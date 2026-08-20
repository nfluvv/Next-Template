import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { Button, Container } from "@/shared/client/ui"

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

export async function ForbiddenPage({ searchParams }: ForbiddenPageProps) {
  const { reason } = await searchParams
  const t = await getTranslations("forbidden")

  const MESSAGES: Record<string, MessageContent> = {
    unauthenticated: {
      title: t("unauthenticatedTitle"),
      description: t("unauthenticatedDescription"),
      actions: [
        {
          label: t("unauthenticatedAction"),
          href: "/login",
          variant: "default",
        },
      ],
    },
    forbidden: {
      title: t("forbiddenTitle"),
      description: t("forbiddenDescription"),
      actions: [{ label: t("forbiddenAction"), href: "/", variant: "outline" }],
    },
  }

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
