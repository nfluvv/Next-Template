"use server"

import { hash } from "bcrypt-ts"
import { prisma } from "@/shared/api/prisma"
import { credentialsSchema, nameSchema } from "@/entities/user"
import { generateUniqueUsername } from "@/entities/user/lib/generate-username"
import { createVerificationToken } from '@/features/auth/lib/tokens/verification-token'
import { sendVerificationEmail } from '@/features/auth/lib/mail/send-verification-email'
import { checkRateLimit } from '@/shared/lib/rate-limit'
import { getClientIp } from '@/shared/lib/get-client-ip'

type RegisterResult = { success: true } | { success: false; error: string }

export const registerUser = async (raw: unknown): Promise<RegisterResult> => {
  const ip = await getClientIp();
  const allowed = await checkRateLimit(`register:ip:${ip}`, { limit: 3, windowMs: 10 * 60_000 });
  if (!allowed) {
    return { success: false, error: 'Слишком много попыток. Попробуйте позже.' };
  }

  const parsed = credentialsSchema.and(nameSchema).safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: "Некорректные данные" }
  }

  const { email, password, name } = parsed.data;

  const username = await generateUniqueUsername(email.split("@")[0])

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing?.emailVerified) {
    return { success: false, error: 'Пользователь с таким email уже существует' };
  }

  if (existing && !existing.emailVerified) {
    const passwordHash = await hash(password, 10); 
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, name },
    });

    const token = await createVerificationToken(email);
    await sendVerificationEmail(email, token);

    return { success: true };
  }

  const token = await createVerificationToken(email)
  await sendVerificationEmail(email, token)

  const passwordHash = await hash(password, 10); 

  await prisma.user.create({
    data: { email, passwordHash, username, name },
  })

  return { success: true }
}
