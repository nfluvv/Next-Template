import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ForbiddenPage } from "@/views/forbidden"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("forbiddenTitle"),
  }
}

export default ForbiddenPage
