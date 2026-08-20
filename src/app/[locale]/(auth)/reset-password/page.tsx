import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ResetPasswordView } from "@/views/reset-password"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("resetPasswordTitle"),
  }
}

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams
  return <ResetPasswordView token={token} />
}
