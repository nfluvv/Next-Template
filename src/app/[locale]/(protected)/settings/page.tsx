import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { SettingsPage } from "@/views/settings"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("settingsTitle"),
  }
}

export default SettingsPage
