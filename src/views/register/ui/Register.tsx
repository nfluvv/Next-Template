import { RegisterForm } from "@/features/register-user"
import { Container } from "@/shared/client/ui"

export function RegisterPage() {
  return (
    <Container className="flex min-h-[calc(100vh-90px)] items-center justify-center">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </Container>
  )
}
