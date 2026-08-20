import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ForgotPasswordView } from "@/views/forgot-password"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("forgotPasswordTitle"),
  }
}

export default ForgotPasswordView
