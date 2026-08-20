"use server"

import { compare } from "bcrypt-ts"
import { getLocale, getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { createChangeEmailSchema } from "@/entities/user"
import { verifyTotpCode, decryptSecret } from "@/shared/server/auth/totp"
import { createEmailChangeToken } from "../lib/email-change-token"
import { sendEmailChangeConfirmation } from "../lib/send-email-change-confirmation"
import { checkRateLimit } from "@/shared/server/security/rate-limit"
import { getClientIp } from "@/shared/server/lib/get-client-ip"

type RequestResult = { success: true } | { success: false; error: string }

export const requestEmailChange = async (
  raw: unknown
): Promise<RequestResult> => {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const ip = await getClientIp()
  const allowed = await checkRateLimit(`change-email:ip:${ip}`, {
    limit: 5,
    windowMs: 60_000,
  })
  if (!allowed) return { success: false, error: "Too many tries. Try later." }

  const t = await getTranslations("validation")
  const parsed = createChangeEmailSchema(t).safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Incorrect data",
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      passwordHash: true,
      twoFactorEnabled: true,
      twoFactorSecret: true,
    },
  })
  if (!user) return { success: false, error: "User not found" }

  if (user.passwordHash) {
    if (!parsed.data.password)
      return { success: false, error: "Enter your password" }
    const isValid = await compare(parsed.data.password, user.passwordHash)
    if (!isValid) return { success: false, error: "The password is wrong" }
  }

  if (user.twoFactorEnabled && user.twoFactorSecret) {
    if (!parsed.data.totpCode)
      return { success: false, error: "Enter the code from the app" }
    const isValid = verifyTotpCode(
      decryptSecret(user.twoFactorSecret),
      parsed.data.totpCode
    )
    if (!isValid) return { success: false, error: "Wrong code" }
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.newEmail },
    select: { id: true },
  })
  if (existing) return { success: false, error: "This email is already in use" }

  const token = await createEmailChangeToken(
    session.user.id,
    parsed.data.newEmail
  )

  const locale = await getLocale()
  await sendEmailChangeConfirmation(parsed.data.newEmail, token, locale)

  return { success: true }
}