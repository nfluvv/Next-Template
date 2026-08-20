import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { ResetPasswordForm } from "@/features/reset-password"
import { siteConfig } from "@/shared/client/config/site"
import { Container } from "@/shared/client/ui"

type ResetPasswordViewProps = {
  token?: string
}

export async function ResetPasswordView({ token }: ResetPasswordViewProps) {
  const t = await getTranslations("resetPassword")

  if (!token) {
    return (
      <Container className="flex min-h-[calc(100vh-90px)] items-center justify-center">
        <h1 className="text-2xl font-semibold">{t("invalidTitle")}</h1>
        <p className="max-w-sm text-muted-foreground">
          {t("invalidDescription")}
        </p>
        <Link href={siteConfig.routes.login}>{t("backToLogin")}</Link>
      </Container>
    )
  }

  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </Container>
  )
}
