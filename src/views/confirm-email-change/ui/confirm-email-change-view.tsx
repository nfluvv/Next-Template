import { getTranslations } from "next-intl/server"

import { confirmEmailChangeToken } from "@/features/change-email/api/confirm-email-change"
import { Button } from "@/shared/client/ui"

type ConfirmEmailChangeViewProps = {
  token?: string
}

export async function ConfirmEmailChangeView({
  token,
}: ConfirmEmailChangeViewProps) {
  const t = await getTranslations("confirmEmailChange")

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-90px)] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">{t("invalidTitle")}</h1>
        <p className="max-w-sm text-muted-foreground">
          {t("invalidTokenDescription")}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-90px)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="max-w-sm text-muted-foreground">{t("description")}</p>
      <form action={confirmEmailChangeToken.bind(null, token)}>
        <Button type="submit">{t("confirm")}</Button>
      </form>
    </div>
  )
}
