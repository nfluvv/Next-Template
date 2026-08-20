"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"

type UnlinkResult = { success: true } | { success: false; error: string }

export const unlinkProvider = async (
  provider: "google" | "github"
): Promise<UnlinkResult> => {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Не авторизован" }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true, accounts: { select: { provider: true } } },
  })
  if (!user) return { success: false, error: "User not found" }

  const hasOtherLoginMethod =
    Boolean(user.passwordHash) || user.accounts.length > 1
  if (!hasOtherLoginMethod) {
    return {
      success: false,
      error: "It's impossible to unlink the only login method for an account",
    }
  }

  await prisma.account.deleteMany({
    where: { userId: session.user.id, provider },
  })

  revalidatePath("/settings")
  return { success: true }
}
