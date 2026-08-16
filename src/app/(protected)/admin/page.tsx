import type { Metadata } from "next"
import { AdminPage } from "@/views/admin"

export const metadata: Metadata = {
  title: "Админ-панель",
}

type AdminRouteProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AdminRoute({ searchParams }: AdminRouteProps) {
  return <AdminPage searchParams={searchParams} />
}
