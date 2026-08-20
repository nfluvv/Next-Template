import "server-only"
import { Resend } from "resend"

import type { Mailer } from "./types"

const resend = new Resend(process.env.RESEND_API_KEY)

export const resendMailer: Mailer = {
  send: async ({ to, subject, html }) => {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    })

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }
  },
}
