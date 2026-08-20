import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { siteConfig } from "@/shared/client/config/site"

export async function VerifyEmailInvalidView() {
  const t = await getTranslations("verifyEmail")

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{t("invalidTitle")}</h1>
      <p className="max-w-sm text-muted-foreground">
        {t("expiredDescription")}
      </p>
      <Link href={siteConfig.routes.login}>{t("login")}</Link>
    </div>
  )
}
