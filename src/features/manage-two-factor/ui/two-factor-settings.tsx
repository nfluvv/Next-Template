"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import {
  confirmTwoFactorSetup,
  disableTwoFactor,
  initiateTwoFactorSetup,
} from "../api/setup"

import { TwoFactorBackupCodes } from "./two-factor-backup-codes"
import { TwoFactorCodeForm } from "./two-factor-code-form"
import { TwoFactorSetup } from "./two-factor-setup"

type Step = "idle" | "scanning" | "backup-codes"

type TwoFactorSettingsProps = {
  isEnabled: boolean
}

export function TwoFactorSettings({ isEnabled }: TwoFactorSettingsProps) {
  const router = useRouter()
  const t = useTranslations("twoFactor")

  const [step, setStep] = useState<Step>("idle")
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const handleStartSetup = async () => {
    const result = await initiateTwoFactorSetup()

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setQrCode(result.qrCodeDataUrl)
    setSecret(result.secret)
    setStep("scanning")
  }

  const handleConfirm = async (code: string) => {
    const result = await confirmTwoFactorSetup(code)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setBackupCodes(result.backupCodes)
    setStep("backup-codes")
  }

  const handleDisable = async (code: string) => {
    const result = await disableTwoFactor(code)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(t("disabledSuccess"))
    router.refresh()
  }

  const handleDone = () => {
    setStep("idle")
    setQrCode(null)
    setSecret(null)
    setBackupCodes([])
    router.refresh()
  }

  if (step === "backup-codes") {
    return <TwoFactorBackupCodes codes={backupCodes} onDone={handleDone} />
  }

  if (step === "scanning" && qrCode && secret) {
    return (
      <TwoFactorSetup
        qrCode={qrCode}
        secret={secret}
        onConfirm={handleConfirm}
      />
    )
  }

  if (isEnabled) {
    return <TwoFactorCodeForm mode="disable" onSubmit={handleDisable} />
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">
        {t("notEnabledDescription")}
      </p>

      <button
        type="button"
        onClick={handleStartSetup}
        className="cursor-pointer ..."
      >
        {t("enable")}
      </button>
    </div>
  )
}
