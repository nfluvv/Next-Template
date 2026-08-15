'use server';

import bcrypt from 'bcryptjs';

import { auth } from '@/shared/config/auth';
import { prisma } from '@/shared/api/prisma';
import { changeEmailSchema } from '@/entities/user';
import { verifyTotpCode, decryptSecret } from '@/shared/lib/totp';
import { createEmailChangeToken } from '../lib/email-change-token';
import { sendEmailChangeConfirmation } from '../lib/send-email-change-confirmation';
import { checkRateLimit } from '@/shared/lib/rate-limit';
import { getClientIp } from '@/shared/lib/get-client-ip';

type RequestResult = { success: true } | { success: false; error: string };

export const requestEmailChange = async (raw: unknown): Promise<RequestResult> => {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Не авторизован' };

  const ip = await getClientIp();
  const allowed = await checkRateLimit(`change-email:ip:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!allowed) return { success: false, error: 'Слишком много попыток. Попробуйте позже.' };

  const parsed = changeEmailSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Некорректные данные' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true, twoFactorEnabled: true, twoFactorSecret: true },
  });
  if (!user) return { success: false, error: 'Пользователь не найден' };

  if (user.passwordHash) {
    if (!parsed.data.password) return { success: false, error: 'Введите пароль' };
    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) return { success: false, error: 'Неверный пароль' };
  }

  if (user.twoFactorEnabled && user.twoFactorSecret) {
    if (!parsed.data.totpCode) return { success: false, error: 'Введите код из приложения' };
    const isValid = verifyTotpCode(decryptSecret(user.twoFactorSecret), parsed.data.totpCode);
    if (!isValid) return { success: false, error: 'Неверный код' };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.newEmail },
    select: { id: true },
  });
  if (existing) return { success: false, error: 'Этот email уже используется' };

  const token = await createEmailChangeToken(session.user.id, parsed.data.newEmail);
  await sendEmailChangeConfirmation(parsed.data.newEmail, token);

  return { success: true };
};