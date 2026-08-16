import Link from "next/link"
import { Button, Container } from "@/shared/ui"

type ActionButton = {
  label: string
  href: string
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

type MessageContent = {
  title: string
  description: string
  actions: ActionButton[]
}

type ForbiddenPageProps = {
  searchParams: Promise<{ reason?: string }>
}

const MESSAGES: Record<string, MessageContent> = {
  unauthenticated: {
    title: "Нужна авторизация",
    description: "Чтобы попасть на эту страницу, сначала войдите в аккаунт.",
    actions: [{ label: "Войти", href: "/login", variant: "default" }],
  },
  forbidden: {
    title: "Доступ запрещён",
    description: "У вас недостаточно прав для просмотра этой страницы.",
    actions: [{ label: "На главную", href: "/", variant: "outline" }],
  },
}

export async function ForbiddenPage({ searchParams }: ForbiddenPageProps) {
  const { reason } = await searchParams
  const currentReason = reason && MESSAGES[reason] ? reason : "forbidden"
  const { title, description, actions } = MESSAGES[currentReason]

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="max-w-sm text-muted-foreground">{description}</p>

      <div className="flex gap-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant={action.variant ?? "default"}
            asChild
          >
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ))}
      </div>
    </Container>
  )
}
