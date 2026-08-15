import type { Metadata } from "next"
import { ResetPasswordView } from "@/views/reset-password"

export const metadata: Metadata = {
  title: "Сброс пароля",
}

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams
  return <ResetPasswordView token={token} />
}