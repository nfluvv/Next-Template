import { getTranslations } from "next-intl/server"

import { verifyEmailToken } from "@/features/verify-email/api/email-verification"
import { Button } from "@/shared/client/ui"

type VerifyEmailViewProps = {
  token?: string
}

export async function VerifyEmailView({ token }: VerifyEmailViewProps) {
  const t = await getTranslations("verifyEmail")

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">{t("invalidTitle")}</h1>
        <p className="max-w-sm text-muted-foreground">
          {t("invalidTokenDescription")}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="max-w-sm text-muted-foreground">{t("description")}</p>
      <form action={verifyEmailToken.bind(null, token)}>
        <Button type="submit">{t("confirm")}</Button>
      </form>
    </div>
  )
}
