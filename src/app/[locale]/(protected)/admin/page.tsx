import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { AdminPage } from "@/views/admin"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  return {
    title: t("adminTitle"),
  }
}

type AdminRouteProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AdminRoute({ searchParams }: AdminRouteProps) {
  return <AdminPage searchParams={searchParams} />
}
