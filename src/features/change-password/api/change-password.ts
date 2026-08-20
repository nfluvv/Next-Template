"use server"

import { hash, compare } from "bcrypt-ts"
import { getTranslations } from "next-intl/server"

import { auth, signOut } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

import { createChangePasswordSchema } from "../model/schema"
import { checkRateLimit } from "@/shared/server/security/rate-limit"

type ChangePasswordResult =
  { success: true } | { success: false; error: string }

export const changePassword = async (
  raw: unknown
): Promise<ChangePasswordResult> => {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const allowed = await checkRateLimit(
    `change-password:user:${session.user.id}`,
    {
      limit: 5,
      windowMs: 60_000,
    }
  )
  if (!allowed) {
    return { success: false, error: "Too many tries. Try later." }
  }

  const t = await getTranslations("validation")
  const parsed = createChangePasswordSchema(t).safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Incorrect dat",
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  })

  if (!user) {
    return { success: false, error: "User not found" }
  }

  if (user.passwordHash) {
    if (!parsed.data.currentPassword) {
      return { success: false, error: "Enter password" }
    }

    const isValid = await compare(
      parsed.data.currentPassword,
      user.passwordHash
    )
    if (!isValid) {
      return { success: false, error: "The password is wrong" }
    }
  }

  const newPasswordHash = await hash(parsed.data.newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newPasswordHash },
  })

  await signOut({ redirectTo: `/login?passwordChanged=1` })
  return { success: true }
}
