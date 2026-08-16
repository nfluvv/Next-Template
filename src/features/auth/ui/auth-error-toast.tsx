"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-hot-toast"

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Этот email уже используется другим способом входа. Попробуйте войти так, как регистрировались изначально.",
  OAuthSignin: "Не удалось начать вход через провайдер. Попробуйте ещё раз.",
  OAuthCallback:
    "Ошибка при обработке ответа от провайдера. Попробуйте ещё раз.",
  AccessDenied:
    "Не удалось привязать аккаунт — убедитесь, что используете тот же email.",
  Verification: "Ссылка для входа устарела или уже использована.",
  CredentialsSignin: "Неверный email или пароль.",
  Configuration: "Ошибка конфигурации сервера. Обратитесь к администратору.",
  Default: "Что-то пошло не так при входе. Попробуйте ещё раз.",
}

export const AuthErrorToast = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const error = searchParams.get("error")
    const verified = searchParams.get("verified")

    if (error) {
      toast.error(ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default)
      router.replace("/login")
      return
    }

    if (verified) {
      toast.success("Email подтверждён. Войдите, чтобы продолжить.")
      router.replace("/login")
    }
  }, [searchParams, router])

  return null
}
