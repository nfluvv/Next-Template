"use client"

import { useLocale } from "next-intl"
import { useParams } from "next/navigation"
import { useTransition } from "react"
import { Check, Globe } from "lucide-react"

import { usePathname, useRouter } from "@/shared/i18n/navigation"
import { routing } from "@/shared/i18n/routing"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/client/ui"

import { localeLabels } from "../config/locale-labels"

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSelect = (nextLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- next-intl
        { pathname, params },
        { locale: nextLocale }
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="group flex items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:opacity-60"
        >
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase">{locale}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-40 rounded-xl border-border/70 p-1.5"
      >
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onSelect={() => handleSelect(loc)}
            className="flex items-center justify-between"
          >
            <span>{localeLabels[loc] ?? loc}</span>
            {loc === locale && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
