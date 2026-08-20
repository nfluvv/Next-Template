"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/shared/client/ui"

type TwoFactorBackupCodesProps = {
  codes: string[]
  onDone: () => void
}

export function TwoFactorBackupCodes({
  codes,
  onDone,
}: TwoFactorBackupCodesProps) {
  const t = useTranslations("twoFactor")

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 font-mono text-[9px] font-semibold tracking-[0.2em] text-muted-foreground/60 uppercase">
          {t("backupStep")}
        </div>

        <h3 className="text-sm font-semibold">{t("backupTitle")}</h3>

        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {t("backupDescription")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60">
        {codes.map((code) => (
          <div
            key={code}
            className="bg-muted/40 px-3 py-2.5 text-center font-mono text-xs"
          >
            {code}
          </div>
        ))}
      </div>

      <Button type="button" onClick={onDone} className="w-full sm:w-auto">
        {t("done")}
      </Button>
    </div>
  )
}
