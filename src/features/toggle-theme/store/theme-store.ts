"use client"

import { create } from "zustand"

export type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

const STORAGE_KEY = "theme"
const COOKIE_KEY = "theme"
const RESOLVED_COOKIE_KEY = "resolved-theme"

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === "system" ? getSystemTheme() : theme

const applyThemeClass = (resolved: ResolvedTheme) => {
  document.documentElement.classList.toggle("dark", resolved === "dark")
}

const setCookie = (key: string, value: string) => {
  // 1 год, доступна на всех путях
  document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax`
}

type ThemeState = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  init: () => void
  setTheme: (theme: Theme) => void
  syncWithSystem: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "system",
  resolvedTheme: "dark",

  init: () => {
    const stored = localStorage.getItem(STORAGE_KEY)

    const theme: Theme =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system"

    const resolved: ResolvedTheme = document.documentElement.classList.contains(
      "dark"
    )
      ? "dark"
      : "light"

    set({ theme, resolvedTheme: resolved })
  },

  setTheme: (theme) => {
    const resolved = resolveTheme(theme)

    localStorage.setItem(STORAGE_KEY, theme)
    setCookie(COOKIE_KEY, theme)
    setCookie(RESOLVED_COOKIE_KEY, resolved)
    applyThemeClass(resolved)

    set({ theme, resolvedTheme: resolved })
  },

  syncWithSystem: () => {
    if (get().theme !== "system") return

    const resolved = getSystemTheme()

    setCookie(RESOLVED_COOKIE_KEY, resolved)
    applyThemeClass(resolved)

    set({ resolvedTheme: resolved })
  },
}))
