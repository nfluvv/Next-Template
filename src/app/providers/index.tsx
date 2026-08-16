"use client"

import type { PropsWithChildren } from "react"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: "toast",
              duration: 3000,
            }}
          />
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
