"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

import { Button } from "@/shared/ui"

export const SignOutButton = () => {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="mr-2 size-4" />
      Выйти
    </Button>
  )
}
