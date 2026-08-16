import "server-only"

import { mailer } from "@/shared/lib/mailer"

export const sendEmailChangeConfirmation = async (
  newEmail: string,
  token: string
) => {
  const confirmUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/confirm-email-change?token=${token}`

  await mailer.send({
    to: newEmail,
    subject: "Подтвердите новый email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Подтверждение нового email</h2>
        <p>Вы запросили смену email на этот адрес. Перейдите по ссылке, чтобы подтвердить. Ссылка действует 1 час.</p>
        <a href="${confirmUrl}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
          Подтвердить новый email
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Если вы не запрашивали смену email — просто проигнорируйте это письмо.
        </p>
      </div>
    `,
  })
}
