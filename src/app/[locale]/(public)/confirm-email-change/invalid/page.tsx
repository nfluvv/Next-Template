import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ConfirmEmailChangeInvalidView } from "@/views/confirm-email-change"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("confirmEmailChangeTitle"),
  }
}

export default ConfirmEmailChangeInvalidView
