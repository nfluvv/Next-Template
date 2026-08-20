"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTranslations } from "next-intl"

import { useThemeStore, type Theme } from "../store/theme-store"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/client/ui"

const OPTIONS: Array<{
  value: Theme
  icon: typeof Sun
}> = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
]

export function ThemeToggle() {
  const t = useTranslations("themes")

  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("toggle")}
        >
          <Sun className="size-4 scale-100 transition-transform dark:scale-0" />
          <Moon className="absolute size-4 scale-0 transition-transform dark:scale-100" />
          <span className="sr-only">{t("toggle")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={theme === value ? "font-medium" : undefined}
          >
            <Icon className="mr-2 size-4" />
            {t(value)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
