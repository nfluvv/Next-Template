import { confirmEmailChangeToken } from "@/features/user-profile/api/confirm-email-change"
import { Button } from "@/shared/ui"

type ConfirmEmailChangeViewProps = {
  token?: string
}

export function ConfirmEmailChangeView({ token }: ConfirmEmailChangeViewProps) {
  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Ссылка недействительна</h1>
        <p className="max-w-sm text-muted-foreground">
          В ссылке отсутствует токен подтверждения.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Подтверждение нового email</h1>
      <p className="max-w-sm text-muted-foreground">
        Нажмите кнопку, чтобы подтвердить смену email.
      </p>
      <form action={confirmEmailChangeToken.bind(null, token)}>
        <Button type="submit">Подтвердить</Button>
      </form>
    </div>
  )
}
