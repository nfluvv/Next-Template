import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Inter, Manrope } from "next/font/google"

import { siteConfig } from "@/shared/client/config/site"

import "./globals.css"

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
})

const fontDisplay = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `${siteConfig.name} | %s`,
  },
  description: siteConfig.description,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const resolvedTheme = cookieStore.get("resolved-theme")?.value

  const isDark = resolvedTheme !== "light"

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable} ${
        isDark ? "dark" : ""
      }`}
    >
      <body>{children}</body>
    </html>
  )
}
