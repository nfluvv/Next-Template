import 'server-only';

import { mailer } from '@/shared/lib/mailer';

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/verify-email?token=${token}`;

  await mailer.send({
    to: email,
    subject: 'Подтвердите email',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Подтверждение email</h2>
        <p>Перейдите по ссылке, чтобы подтвердить свой email. Ссылка действует 24 часа.</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
          Подтвердить email
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Если вы не регистрировались — просто проигнорируйте это письмо.
        </p>
      </div>
    `,
  });
};