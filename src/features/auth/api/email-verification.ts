'use server';

import { redirect } from 'next/navigation';

import { prisma } from '@/shared/api/prisma';
import { consumeVerificationToken, createVerificationToken } from '@/features/auth/lib/tokens/verification-token';
import { sendVerificationEmail } from '@/features/auth/lib/mail/send-verification-email';
import { createAutoLoginToken } from '@/features/auth/lib/tokens/auto-login-token';
import { signIn } from '@/shared/config/auth';
import { checkRateLimit } from '@/shared/lib/rate-limit';

export const isEmailVerified = async (email: string): Promise<boolean | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true, passwordHash: true },
  });

  if (!user || !user.passwordHash) return null;
  return Boolean(user.emailVerified);
};

type RequestVerificationResult = { success: true } | { success: false; error: string };

export const requestVerificationEmail = async (email: string): Promise<RequestVerificationResult> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });

  const allowed = await checkRateLimit(`verify-email:email:${email}`, { limit: 3, windowMs: 60 * 60_000 });

  if (user && !user.emailVerified && allowed) {
    const token = await createVerificationToken(email);
    await sendVerificationEmail(email, token);
  }

  return { success: true };
};

export async function verifyEmailToken(token: string) {
  const email = await consumeVerificationToken(token);

  if (!email) {
    redirect('/verify-email/invalid');
  }

  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  const autoLoginToken = createAutoLoginToken(user.id);
  const result = await signIn('auto-login', { token: autoLoginToken, redirect: false });

  if (result?.error) {
    redirect('/login?verified=1');
  }

  redirect(user.username ? `/users/${user.username}` : '/settings');
}