import { Suspense } from "react"

import { LoginForm } from "@/features/auth"
import { AuthErrorToast } from "@/features/auth"
import { Container } from "@/shared/ui"

export function LoginPage() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <Suspense fallback={null}>
        <AuthErrorToast />
      </Suspense>
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold text-center">Вход</h1>
        <LoginForm />
      </div>
    </Container>
  )
}
