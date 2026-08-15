'use server';

import { prisma } from '@/shared/api/prisma';
import { emailSchema } from '@/entities/user';
import { createPasswordResetToken } from '@/features/auth/lib/tokens/password-reset-token';
import { sendPasswordResetEmail } from '@/features/auth/lib/mail/send-password-reset-email';
import { checkRateLimit } from '@/shared/lib/rate-limit';

type RequestResult = { success: true } | { success: false; error: string };

export const requestPasswordReset = async (raw: unknown): Promise<RequestResult> => {
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'Некорректный email' };
  }

  const allowed = await checkRateLimit(`reset-password:email:${parsed.data.email}`, {
    limit: 3,
    windowMs: 60 * 60_000,
  });

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });

  if (user && allowed) {
    const token = await createPasswordResetToken(parsed.data.email);
    await sendPasswordResetEmail(parsed.data.email, token);
  }

  return { success: true };
};