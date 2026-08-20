"use server"

import { hash } from "bcrypt-ts"
import { getLocale, getTranslations } from "next-intl/server"

import { prisma } from "@/shared/server/db/prisma"
import { createCredentialsSchema, createNameSchema } from "@/entities/user"
import { generateUniqueUsername } from "@/entities/user/lib/generate-username"
import { createVerificationToken } from "@/shared/server/auth/verification-token"
import { sendVerificationEmail } from "@/shared/server/integrations/mailer/send-verification-email"
import { checkRateLimit } from "@/shared/server/security/rate-limit"
import { getClientIp } from "@/shared/server/lib/get-client-ip"

type RegisterResult = { success: true } | { success: false; error: string }

export const registerUser = async (raw: unknown): Promise<RegisterResult> => {
  const ip = await getClientIp()
  const allowed = await checkRateLimit(`register:ip:${ip}`, {
    limit: 3,
    windowMs: 10 * 60_000,
  })
  if (!allowed) {
    return {
      success: false,
      error: "Too many attempts. Please try again later.",
    }
  }

  const t = await getTranslations("validation")
  const parsed = createCredentialsSchema(t)
    .and(createNameSchema(t))
    .safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: "Invalid data" }
  }

  const { email, password, name } = parsed.data

  const username = await generateUniqueUsername(email.split("@")[0])
  const locale = await getLocale()

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing?.emailVerified) {
    return {
      success: false,
      error: "A user with this email already exists",
    }
  }

  if (existing && !existing.emailVerified) {
    const passwordHash = await hash(password, 10)
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, name },
    })

    const token = await createVerificationToken(email)
    await sendVerificationEmail(email, token, locale)

    return { success: true }
  }

  const token = await createVerificationToken(email)
  await sendVerificationEmail(email, token, locale)

  const passwordHash = await hash(password, 10)

  await prisma.user.create({
    data: { email, passwordHash, username, name },
  })

  return { success: true }
}