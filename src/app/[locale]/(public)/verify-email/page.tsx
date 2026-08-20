import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { VerifyEmailView } from "@/views/verify-email"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("verifyEmailTitle"),
  }
}

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams
  return <VerifyEmailView token={token} />
}
