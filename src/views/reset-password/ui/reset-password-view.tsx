import Link from "next/link"

import { ResetPasswordForm } from "@/features/auth"
import { siteConfig } from "@/shared/config/site"
import { Container } from "@/shared/ui"

type ResetPasswordViewProps = {
  token?: string
}

export function ResetPasswordView({ token }: ResetPasswordViewProps) {
  if (!token) {
    return (
      <Container className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-semibold">Ссылка недействительна</h1>
        <p className="max-w-sm text-muted-foreground">
          В ссылке отсутствует токен сброса пароля.
        </p>
        <Link href={siteConfig.routes.login}>Войти</Link>
      </Container>
    )
  }

  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <ResetPasswordForm token={token} />
      </div>
    </Container>
  )
}
