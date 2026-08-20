"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

const ERROR_KEYS = [
  "OAuthAccountNotLinked",
  "OAuthSignin",
  "OAuthCallback",
  "AccessDenied",
  "Verification",
  "CredentialsSignin",
  "Configuration",
] as const

export const AuthErrorToast = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("authError")

  useEffect(() => {
    const error = searchParams.get("error")
    const verified = searchParams.get("verified")

    if (error) {
      const key = ERROR_KEYS.find((k) => k === error)
      toast.error(key ? t(key) : t("Default"))
      router.replace("/login")
      return
    }

    if (verified) {
      toast.success(t("emailVerified"))
      router.replace("/login")
    }
  }, [searchParams, router, t])

  return null
}
