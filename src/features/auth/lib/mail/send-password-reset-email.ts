import 'server-only';

import { mailer } from '@/shared/lib/mailer';

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/reset-password?token=${token}`;

  await mailer.send({
    to: email,
    subject: 'Сброс пароля',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Сброс пароля</h2>
        <p>Перейдите по ссылке, чтобы задать новый пароль. Ссылка действует 1 час.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
          Сбросить пароль
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.
        </p>
      </div>
    `,
  });
};