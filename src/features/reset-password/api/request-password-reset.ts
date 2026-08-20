"use server"

import { getTranslations } from "next-intl/server"

import { prisma } from "@/shared/server/db/prisma"
import { createEmailSchema } from "@/entities/user"
import { createPasswordResetToken } from "@/shared/server/auth/password-reset-token"
import { sendPasswordResetEmail } from "@/shared/server/integrations/mailer/send-password-reset-email"
import { checkRateLimit } from "@/shared/server/security/rate-limit"

type RequestResult = { success: true } | { success: false; error: string }

export const requestPasswordReset = async (
  raw: unknown
): Promise<RequestResult> => {
  const t = await getTranslations("validation")
  const parsed = createEmailSchema(t).safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: "Invalid email" }
  }

  const allowed = await checkRateLimit(
    `reset-password:email:${parsed.data.email}`,
    {
      limit: 3,
      windowMs: 60 * 60_000,
    }
  )

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  })

  if (user && allowed) {
    const token = await createPasswordResetToken(parsed.data.email)
    await sendPasswordResetEmail(parsed.data.email, token)
  }

  return { success: true }
}
