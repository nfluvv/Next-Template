import type { Metadata } from "next"
import { Manrope, Inter } from "next/font/google"
import Script from "next/script"

import { siteConfig } from "@/shared/config/site"
import { Header } from "@/widgets/header"
import { AppProviders } from "@/app/providers"

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
    default: `${siteConfig.name} | Главная`,
    template: `${siteConfig.name} | %s`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${fontSans.variable} ${fontDisplay.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var theme = localStorage.getItem('theme') || 'system';

                var isDark =
                  theme === 'dark' ||
                  (
                    theme === 'system' &&
                    window.matchMedia(
                      '(prefers-color-scheme: dark)'
                    ).matches
                  );

                document.documentElement.classList.toggle('dark', isDark);
              } catch (e) {}
            })();
          `}
        </Script>

        <AppProviders>
          <Header />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
