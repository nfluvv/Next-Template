"use client"

import { useEffect } from "react"
import Link from "next/link"

import { siteConfig } from "@/shared/config/site"
import { Button } from "@/shared/ui"

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Что-то пошло не так</h1>

      <p className="max-w-sm text-muted-foreground">
        Произошла непредвиденная ошибка. Мы уже знаем о проблеме — попробуйте
        обновить страницу.
      </p>

      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground/60">
          ID ошибки: {error.digest}
        </p>
      )}

      <div className="flex gap-2">
        <Button onClick={reset}>Попробовать снова</Button>

        <Link href={siteConfig.routes.home}>На главную</Link>
      </div>
    </div>
  )
}
