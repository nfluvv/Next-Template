import 'server-only';

import { prisma } from '@/shared/api/prisma';

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export const checkRateLimit = async (
  identifier: string,
  { limit, windowMs }: RateLimitOptions,
): Promise<boolean> => {
  const windowStart = new Date(Date.now() - windowMs);

  // опортунистическая чистка протухших попыток — держим таблицу компактной,
  // без отдельной cron-задачи
  await prisma.rateLimitAttempt.deleteMany({
    where: { identifier, createdAt: { lt: windowStart } },
  });

  const count = await prisma.rateLimitAttempt.count({
    where: { identifier, createdAt: { gte: windowStart } },
  });

  if (count >= limit) return false;

  await prisma.rateLimitAttempt.create({ data: { identifier } });
  return true;
};