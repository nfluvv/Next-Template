'use server';

import { revalidatePath } from 'next/cache';

import { auth } from '@/shared/config/auth';
import { prisma } from '@/shared/api/prisma';

type UnlinkResult = { success: true } | { success: false; error: string };

export const unlinkProvider = async (provider: 'google' | 'github'): Promise<UnlinkResult> => {
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Не авторизован' };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true, accounts: { select: { provider: true } } },
  });
  if (!user) return { success: false, error: 'Пользователь не найден' };

  const hasOtherLoginMethod = Boolean(user.passwordHash) || user.accounts.length > 1;
  if (!hasOtherLoginMethod) {
    return { success: false, error: 'Нельзя отвязать единственный способ входа в аккаунт' };
  }

  await prisma.account.deleteMany({
    where: { userId: session.user.id, provider },
  });

  revalidatePath('/settings');
  return { success: true };
};