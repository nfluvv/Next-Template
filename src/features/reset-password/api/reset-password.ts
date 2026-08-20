"use server"

import { hash } from "bcrypt-ts"
import { getTranslations } from "next-intl/server"

import { prisma } from "@/shared/server/db/prisma"
import { createResetPasswordSchema } from "@/entities/user"
import { consumePasswordResetToken } from "@/shared/server/auth/password-reset-token"

type ResetResult = { success: true } | { success: false; error: string }

export const resetPassword = async (
  token: string,
  raw: unknown
): Promise<ResetResult> => {
  const t = await getTranslations("validation")
  const parsed = createResetPasswordSchema(t).safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data",
    }
  }

  const email = await consumePasswordResetToken(token)
  if (!email) {
    return {
      success: false,
      error: "The link has expired or has already been used",
    }
  }

  const passwordHash = await hash(parsed.data.newPassword, 10)

  await prisma.user.update({
    where: { email },
    data: { passwordHash, emailVerified: new Date() },
  })

  return { success: true }
}
