export type SendEmailParams = {
  to: string
  subject: string
  html: string
}

export type Mailer = {
  send: (params: SendEmailParams) => Promise<void>
}
