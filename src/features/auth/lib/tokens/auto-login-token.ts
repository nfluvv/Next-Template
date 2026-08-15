import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

const TTL_MS = 1000 * 60 * 5;

const sign = (payload: string) => createHmac('sha256', process.env.AUTH_SECRET || '').update(payload).digest('hex');

export const createAutoLoginToken = (userId: string) => {
  const expires = Date.now() + TTL_MS;
  const payload = `${userId}.${expires}`;
  return `${payload}.${sign(payload)}`;
};

export const verifyAutoLoginToken = (token: string): string | null => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [userId, expiresRaw, signature] = parts;
  const payload = `${userId}.${expiresRaw}`;
  const expectedSignature = sign(payload);

  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  return userId;
};