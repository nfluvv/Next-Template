"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/shared/config/auth"
import { prisma } from "@/shared/api/prisma"
import { nameSchema } from "@/entities/user"

type UpdateNameResult = { success: true } | { success: false; error: string }

export const updateName = async (raw: unknown): Promise<UpdateNameResult> => {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Не авторизован" }
  }

  const parsed = nameSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Некорректные данные",
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  })

  revalidatePath("/settings")

  return { success: true }
}
