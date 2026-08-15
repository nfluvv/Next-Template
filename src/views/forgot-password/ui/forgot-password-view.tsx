import { ForgotPasswordForm } from '@/features/auth';
import { Container } from '@/shared/ui';

export function ForgotPasswordView() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </Container>
  );
}