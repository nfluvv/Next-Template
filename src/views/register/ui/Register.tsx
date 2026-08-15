import { RegisterForm } from '@/features/auth';
import { Container } from '@/shared/ui';

export function RegisterPage() {
  return (
    <Container className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </Container>
  );
}