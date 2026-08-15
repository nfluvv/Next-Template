'use server';

import { compare } from "bcrypt-ts"

import { prisma } from '@/shared/api/prisma';
import { credentialsSchema } from '@/entities/user';

type LoginStep =
  | { step: 'invalid' }
  | { step: 'unverified' }
  | { step: 'needs-2fa' }
  | { step: 'ok' };

export const checkLoginStep = async (raw: unknown): Promise<LoginStep> => {
  const parsed = credentialsSchema.safeParse(raw);
  if (!parsed.success) return { step: 'invalid' };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user?.passwordHash) return { step: 'invalid' };

  const isValid = await compare(parsed.data.password, user.passwordHash);
  if (!isValid) return { step: 'invalid' };

  if (!user.emailVerified) return { step: 'unverified' };
  if (user.twoFactorEnabled) return { step: 'needs-2fa' };

  return { step: 'ok' };
};