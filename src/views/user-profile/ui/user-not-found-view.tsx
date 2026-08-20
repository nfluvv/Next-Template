import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { siteConfig } from "@/shared/client/config/site"
import { Button, Container } from "@/shared/client/ui"

export async function UserNotFoundView() {
  const t = await getTranslations("userNotFound")

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="max-w-sm text-muted-foreground">{t("description")}</p>
      <Link href={siteConfig.routes.home}>
        <Button variant="default">{t("action")}</Button>
      </Link>
    </Container>
  )
}
