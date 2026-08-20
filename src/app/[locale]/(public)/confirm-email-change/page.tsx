import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ConfirmEmailChangeView } from "@/views/confirm-email-change"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("confirmEmailChangeTitle"),
  }
}

type ConfirmEmailChangePageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function ConfirmEmailChangePage({
  searchParams,
}: ConfirmEmailChangePageProps) {
  const { token } = await searchParams
  return <ConfirmEmailChangeView token={token} />
}
