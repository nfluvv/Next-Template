"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { siteConfig } from "@/shared/client/config/site"
import { Button } from "@/shared/client/ui"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errorPage")

  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>

      <p className="max-w-sm text-muted-foreground">{t("description")}</p>

      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground/60">
          {t("errorId", { digest: error.digest })}
        </p>
      )}

      <div className="flex gap-2">
        <Button onClick={reset}>{t("retry")}</Button>

        <Link href={siteConfig.routes.home}>{t("home")}</Link>
      </div>
    </div>
  )
}
