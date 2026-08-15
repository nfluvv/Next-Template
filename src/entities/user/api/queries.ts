import 'server-only';
import { cache } from 'react';

import { prisma } from '@/shared/api/prisma';
import { auth } from '@/shared/config/auth';

const PAGE_SIZE = 20;

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { 
      id: true, 
      name: true, 
      username: true, 
      email: true, 
      image: true, 
      role: true, 
      twoFactorEnabled: true,
      accounts: {
        select: {
          provider: true
        }
      }
    },
  });
});

export const getUserByUsername = cache(async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, username: true, image: true, createdAt: true },
  });
});

export const hasPassword = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  return Boolean(user?.passwordHash);
};

type GetAllUsersParams = {
  query?: string;
  page?: number;
};

export const getAllUsers = async ({ query = '', page = 1 }: GetAllUsersParams = {}) => {
  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    page,
  };
};