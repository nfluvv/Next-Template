import Link from "next/link"

import { siteConfig } from "@/shared/config/site"
import { Button, Container } from "@/shared/ui"

export function UserNotFoundView() {
  return (
    <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold">Пользователь не найден</h1>
      <p className="max-w-sm text-muted-foreground">
        Возможно, аккаунт был удалён или ссылка неверна.
      </p>
      <Link href={siteConfig.routes.home}>
        <Button variant="default">На главную</Button>
      </Link>
    </Container>
  )
}
