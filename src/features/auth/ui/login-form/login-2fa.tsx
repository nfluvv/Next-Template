import { Button, Input } from "@/shared/ui"

type LoginTwoFactorProps = {
  code: string
  onCodeChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function LoginTwoFactor({
  code,
  onCodeChange,
  onSubmit,
  isSubmitting,
}: LoginTwoFactorProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">Подтверждение входа</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Введите код из приложения-аутентификатора или резервный код.
        </p>
      </div>

      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        maxLength={10}
      />

      <Button
        className="w-full"
        onClick={onSubmit}
        disabled={isSubmitting || !code}
      >
        {isSubmitting ? "Проверяем..." : "Войти"}
      </Button>
    </div>
  )
}
