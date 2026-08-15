import 'server-only';
import { headers } from 'next/headers';

export const getClientIp = async () => {
  const headersList = await headers();

  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return headersList.get('x-real-ip') ?? 'unknown';
};