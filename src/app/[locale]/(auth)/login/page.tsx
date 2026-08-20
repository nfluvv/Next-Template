import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LoginPage } from "@/views/login/ui/Login"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("loginTitle"),
  }
}

export default LoginPage
