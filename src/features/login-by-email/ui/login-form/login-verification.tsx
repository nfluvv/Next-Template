"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/shared/client/ui"

type LoginVerificationProps = {
  email: string | null
  isResending: boolean
  onResend: () => void
}

export function LoginVerification({
  email,
  isResending,
  onResend,
}: LoginVerificationProps) {
  const t = useTranslations("loginVerification")

  if (!email) return null

  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3.5 py-3">
      <p className="text-sm">{t("notVerified")}</p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {t("checkInboxOrResend")}
      </p>

      <Button
        type="button"
        variant="link"
        size="sm"
        className="mt-1 h-auto p-0"
        onClick={onResend}
        disabled={isResending}
      >
        {isResending ? t("resending") : t("resend")}
      </Button>
    </div>
  )
}