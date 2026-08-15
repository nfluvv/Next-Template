"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/shared/config/auth"
import { prisma } from "@/shared/api/prisma"
import { USER_ROLES, type UserRole } from "@/entities/user"

type UpdateUserRoleResult =
  { success: true } | { success: false; error: string }

export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<UpdateUserRoleResult> => {
  const session = await auth()
  if (session?.user.role !== "ADMIN") {
    return { success: false, error: "Недостаточно прав" }
  }

  if (!USER_ROLES.includes(role)) {
    return { success: false, error: "Некорректная роль" }
  }

  if (session.user.id === userId) {
    return { success: false, error: "Нельзя изменить собственную роль" }
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  })

  if (!target) {
    return { success: false, error: "Пользователь не найден" }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { role },
    }),
    prisma.roleChangeLog.create({
      data: {
        targetId: userId,
        targetEmail: target.email,
        changedById: session.user.id,
        fromRole: target.role,
        toRole: role,
      },
    }),
  ])

  revalidatePath("/admin")

  return { success: true }
}
