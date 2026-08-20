import Link from "next/link"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("NotFound")

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center">
      <h1 className="mt-2 text-4xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
      <Link href="/" className="mt-8 rounded-md bg-primary px-5 py-2.5">
        {t("backHome")}
      </Link>
    </main>
  )
}
