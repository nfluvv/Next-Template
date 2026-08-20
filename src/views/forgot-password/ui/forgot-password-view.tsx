import { ForgotPasswordForm } from "@/features/reset-password"
import { Container } from "@/shared/client/ui"

export function ForgotPasswordView() {
  return (
    <Container className="flex min-h-[calc(100vh-90px)] items-center justify-center">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </Container>
  )
}
