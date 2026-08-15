import type { Metadata } from "next"
import { ConfirmEmailChangeView } from "@/views/confirm-email-change"

export const metadata: Metadata = {
  title: "Изменение почты",
}

type ConfirmEmailChangePageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function ConfirmEmailChangePage({ searchParams }: ConfirmEmailChangePageProps) {
  const { token } = await searchParams
  return <ConfirmEmailChangeView token={token} />
}