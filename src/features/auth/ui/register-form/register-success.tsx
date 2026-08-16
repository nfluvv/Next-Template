import Link from "next/link"

import { siteConfig } from "@/shared/config/site"

type RegisterSuccessProps = {
  email: string
}

export function RegisterSuccess({ email }: RegisterSuccessProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 font-mono text-[9px] font-semibold tracking-[0.25em] text-muted-foreground/60 uppercase">
          02 / VERIFY
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Проверьте почту</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Мы отправили письмо на{" "}
          <span className="font-medium text-foreground">{email}</span>.
          Перейдите по ссылке в письме, чтобы завершить регистрацию.
        </p>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
        <p className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/60 uppercase">
          Verification pending
        </p>
      </div>

      <Link href={siteConfig.routes.login}>Вернуться ко входу</Link>
    </div>
  )
}
