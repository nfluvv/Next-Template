"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import { createNameSchema } from "@/entities/user"

type UpdateNameResult = { success: true } | { success: false; error: string }

export const updateName = async (raw: unknown): Promise<UpdateNameResult> => {
  const session = await auth()

  if (!session?.user) {
    return { success: false, error: "Unauthorized" }
  }

  const t = await getTranslations("validation")
  const parsed = createNameSchema(t).safeParse(raw)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid data",
    }
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  })

  if (currentUser?.name === parsed.data.name) {
    return { success: true }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  })

  revalidatePath("/settings")

  return { success: true }
}
