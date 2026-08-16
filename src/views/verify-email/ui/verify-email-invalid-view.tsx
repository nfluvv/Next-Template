import Link from "next/link"

import { siteConfig } from "@/shared/config/site"

export function VerifyEmailInvalidView() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Ссылка недействительна</h1>
      <p className="max-w-sm text-muted-foreground">
        Ссылка устарела или уже была использована. Попробуйте войти — если email
        всё ещё не подтверждён, там можно запросить письмо заново.
      </p>
      <Link href={siteConfig.routes.login}>Войти</Link>
    </div>
  )
}
