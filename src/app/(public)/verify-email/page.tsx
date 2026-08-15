import type { Metadata } from "next"
import { VerifyEmailView } from "@/views/verify-email"

export const metadata: Metadata = {
  title: "Подтверждение почты",
}

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { token } = await searchParams
  return <VerifyEmailView token={token} />
}