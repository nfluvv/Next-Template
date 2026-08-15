"use server"

import { hash, compare } from "bcrypt-ts"

import { auth } from "@/shared/config/auth"
import { prisma } from "@/shared/api/prisma"

import { changePasswordSchema } from "../model/schema"
import { checkRateLimit } from '@/shared/lib/rate-limit';
import { getClientIp } from '@/shared/lib/get-client-ip';

type ChangePasswordResult =
  { success: true } | { success: false; error: string }

export const changePassword = async (
  raw: unknown
): Promise<ChangePasswordResult> => {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: "Не авторизован" }
  }

  const ip = await getClientIp();
  const allowed = await checkRateLimit(`login:ip:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!allowed) {
    return { success: false, error: 'Слишком много попыток. Попробуйте позже.' };
  }

  const parsed = changePasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Некорректные данные",
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  })

  if (!user) {
    return { success: false, error: "Пользователь не найден" }
  }

  if (user.passwordHash) {
    if (!parsed.data.currentPassword) {
      return { success: false, error: "Введите текущий пароль" }
    }

    const isValid = await compare(
      parsed.data.currentPassword,
      user.passwordHash
    )
    if (!isValid) {
      return { success: false, error: "Текущий пароль неверный" }
    }
  }

  const newPasswordHash = await hash(parsed.data.newPassword, 10)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newPasswordHash },
  })

  return { success: true }
}
