"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/features/toggle-theme/store/theme-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useThemeStore.getState().init()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => useThemeStore.getState().syncWithSystem()

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return <>{children}</>
}
