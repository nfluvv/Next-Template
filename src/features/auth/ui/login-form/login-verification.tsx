import { Button } from "@/shared/ui"

type LoginVerificationProps = {
  email: string | null
  isResending: boolean
  onResend: () => void
}

export function LoginVerification({
  email,
  isResending,
  onResend,
}: LoginVerificationProps) {
  if (!email) return null

  return (
    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-3.5 py-3">
      <p className="text-sm">Email не подтверждён.</p>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Проверьте почту или запросите письмо повторно.
      </p>

      <Button
        type="button"
        variant="link"
        size="sm"
        className="mt-1 h-auto p-0"
        onClick={onResend}
        disabled={isResending}
      >
        {isResending ? "Отправляем..." : "Отправить письмо снова"}
      </Button>
    </div>
  )
}
