"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { TwoFactorCodeForm } from "./two-factor-code-form"

type TwoFactorSetupProps = {
  qrCode: string
  secret: string
  onConfirm: (code: string) => Promise<void>
}

export function TwoFactorSetup({
  qrCode,
  secret,
  onConfirm,
}: TwoFactorSetupProps) {
  const t = useTranslations("twoFactor")

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">{t("setupTitle")}</h3>

        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {t("setupDescription")}
        </p>
      </div>

      <div className="flex justify-center rounded-lg border border-border/60 bg-muted/30 p-5">
        <Image
          src={qrCode}
          alt={t("qrCodeAlt")}
          width={200}
          height={200}
          className="rounded-md"
        />
      </div>

      <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
        <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-muted-foreground/60 uppercase">
          {t("manualSetupKey")}
        </p>

        <code className="text-xs break-all">{secret}</code>
      </div>

      <TwoFactorCodeForm mode="confirm" onSubmit={onConfirm} />
    </div>
  )
}
