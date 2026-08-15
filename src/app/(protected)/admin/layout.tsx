import { redirect } from "next/navigation"

import { auth } from "@/shared/config/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") redirect("/forbidden?reason=forbidden")

  return <>{children}</>
}
