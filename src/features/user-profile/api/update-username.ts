"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/shared/config/auth"
import { prisma } from "@/shared/api/prisma"
import { usernameSchema } from "@/entities/user"

type UpdateUsernameResult =
  { success: true } | { success: false; error: string }

export const updateUsername = async (
  raw: unknown
): Promise<UpdateUsernameResult> => {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Не авторизован" }
  }

  const parsed = usernameSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Некорректные данные",
    }
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
    select: { id: true },
  })

  if (existing && existing.id !== session.user.id) {
    return { success: false, error: "Этот юзернейм уже занят" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username: parsed.data.username },
  })

  revalidatePath("/settings")
  revalidatePath(`/users/${parsed.data.username}`)

  return { success: true }
}
