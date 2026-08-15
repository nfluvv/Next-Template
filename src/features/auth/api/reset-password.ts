'use server';

import bcrypt from 'bcryptjs';

import { prisma } from '@/shared/api/prisma';
import { resetPasswordSchema } from '@/entities/user';
import { consumePasswordResetToken } from '@/features/auth/lib/tokens/password-reset-token';

type ResetResult = { success: true } | { success: false; error: string };

export const resetPassword = async (token: string, raw: unknown): Promise<ResetResult> => {
  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Некорректные данные' };
  }

  const email = await consumePasswordResetToken(token);
  if (!email) {
    return { success: false, error: 'Ссылка устарела или уже была использована' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash, emailVerified: new Date() },
  });

  return { success: true };
};