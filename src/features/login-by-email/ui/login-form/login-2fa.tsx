import { Button, Input } from "@/shared/client/ui"

type LoginTwoFactorProps = {
  code: string
  onCodeChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

import { useTranslations } from "next-intl"

export function LoginTwoFactor({
  code,
  onCodeChange,
  onSubmit,
  isSubmitting,
}: LoginTwoFactorProps) {
  const t = useTranslations("twoFactorVerify")

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">{t("title")}</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        maxLength={10}
      />

      <Button
        className="w-full"
        onClick={onSubmit}
        disabled={isSubmitting || !code}
      >
        {isSubmitting ? t("submitPending") : t("submit")}
      </Button>
    </div>
  )
}
