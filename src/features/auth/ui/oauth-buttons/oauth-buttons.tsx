"use client"

import { signIn } from "next-auth/react"
import { GitHubIcon, GoogleIcon } from "@/shared/ui"
import { Button } from "@/shared/ui"

const providers = [
  { id: "github", label: "GitHub", icon: GitHubIcon },
  { id: "google", label: "Google", icon: GoogleIcon },
] as const

export const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-3">
      {providers.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => signIn(id, { callbackUrl: "/" })}
        >
          {Icon && <Icon className="mr-2 size-4" />}
          Войти через {label}
        </Button>
      ))}
    </div>
  )
}
