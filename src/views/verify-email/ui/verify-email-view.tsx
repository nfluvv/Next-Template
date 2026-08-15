import { verifyEmailToken } from '@/features/auth/api/email-verification';
import { Button } from '@/shared/ui';

type VerifyEmailViewProps = {
  token?: string;
};

export function VerifyEmailView({ token }: VerifyEmailViewProps) {
  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Ссылка недействительна</h1>
        <p className="max-w-sm text-muted-foreground">В ссылке отсутствует токен подтверждения.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Подтверждение email</h1>
      <p className="max-w-sm text-muted-foreground">Нажмите кнопку, чтобы подтвердить свой email.</p>
      <form action={verifyEmailToken.bind(null, token)}>
        <Button type="submit">Подтвердить email</Button>
      </form>
    </div>
  );
}