import Link from "next/link"

import { siteConfig } from "@/shared/config/site"

export function ConfirmEmailChangeInvalidView() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Ссылка недействительна</h1>
      <p className="max-w-sm text-muted-foreground">
        Ссылка устарела, уже использована, либо email уже занят. Попробуйте
        запросить смену email заново в настройках.
      </p>
      <Link href={siteConfig.routes.settings}>В настройки</Link>
    </div>
  )
}
