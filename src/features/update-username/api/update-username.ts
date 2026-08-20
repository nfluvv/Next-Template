"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { createUsernameSchema } from "@/entities/user"

type UpdateUsernameResult =
  { success: true } | { success: false; error: string }

export const updateUsername = async (
  raw: unknown
): Promise<UpdateUsernameResult> => {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const t = await getTranslations("validation")
  const parsed = createUsernameSchema(t).safeParse(raw)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data",
    }
  }

  const username = parsed.data.username

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })

  if (existing?.id === session.user.id) {
    return { success: true }
  }

  if (existing) {
    return { success: false, error: "This username is already taken" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  })

  revalidatePath("/settings")
  revalidatePath(`/users/${username}`)

  return { success: true }
}
