import "server-only"

import type { Mailer } from "./types"

export const consoleMailer: Mailer = {
  send: async ({ to, subject, html }) => {
    const linkMatch = html.match(/href="([^"]+)"/)

    console.log("\n📧 [DEV MAILER] Письмо не отправлено, вывожу в консоль:")
    console.log(`   Кому: ${to}`)
    console.log(`   Тема: ${subject}`)
    if (linkMatch) console.log(`   Ссылка: ${linkMatch[1]}`)
    console.log("")
  },
}
