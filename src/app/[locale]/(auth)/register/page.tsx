import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { RegisterPage } from "@/views/register"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("registerTitle"),
  }
}

export default RegisterPage
