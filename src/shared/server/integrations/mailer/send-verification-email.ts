import "server-only"

import { getTranslations } from "next-intl/server"

import { mailer } from "@/shared/server/integrations/mailer"

export const sendVerificationEmail = async (
  email: string,
  token: string,
  locale: string,
) => {
  const verifyUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/verify-email?token=${token}`
  const t = await getTranslations({ locale, namespace: "emails.verifyEmail" })

  await mailer.send({
    to: email,
    subject: t("subject"),
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>${t("heading")}</h2>
        <p>${t("body")}</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
          ${t("cta")}
        </a>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          ${t("ignoreNote")}
        </p>
      </div>
    `,
  })
}