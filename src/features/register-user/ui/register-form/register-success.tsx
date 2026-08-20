import Link from "next/link"
import { useTranslations } from "next-intl"

import { siteConfig } from "@/shared/client/config/site"

type RegisterSuccessProps = {
  email: string
}

export function RegisterSuccess({ email }: RegisterSuccessProps) {
  const t = useTranslations("registerSuccess")

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 font-mono text-[9px] font-semibold tracking-[0.25em] text-muted-foreground/60 uppercase">
          02 / VERIFY
        </div>

        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t.rich("description", {
            email: () => (
              <span className="font-medium text-foreground">{email}</span>
            ),
          })}
        </p>
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
        <p className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/60 uppercase">
          {t("pending")}
        </p>
      </div>

      <Link href={siteConfig.routes.login}>{t("backToLogin")}</Link>
    </div>
  )
}