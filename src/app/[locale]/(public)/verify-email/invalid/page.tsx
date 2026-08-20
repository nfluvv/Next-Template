import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { VerifyEmailInvalidView } from "@/views/verify-email"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("verifyEmailTitle"),
  }
}

export default VerifyEmailInvalidView
