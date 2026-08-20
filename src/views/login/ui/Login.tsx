import { Suspense } from "react"

import { LoginForm } from "@/features/login-by-email"
import { AuthErrorToast } from "@/shared/client/ui"
import { Container } from "@/shared/client/ui"

import { useTranslations } from "next-intl"

export function LoginPage() {
  const t = useTranslations("Auth")

  return (
    <Container className="flex min-h-[calc(100vh-90px)] items-center justify-center">
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          {t("login")}
        </h1>
        <LoginForm />
      </div>
    </Container>
  )
}
