"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/client/ui"

import { unlinkProvider } from "../api/unlink-provider"

type Provider = "google" | "github"

type LinkProviderButtonProps = {
  provider: Provider
  isLinked: boolean
  providerName: string
}

export const LinkProviderButton = ({
  provider,
  isLinked,
  providerName,
}: LinkProviderButtonProps) => {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const t = useTranslations("linkProvider")
  const tc = useTranslations("common")

  if (!isLinked) {
    return (
      <button
        type="button"
        onClick={() =>
          signIn(provider, {
            callbackUrl: "/settings?linked=1",
          })
        }
        className="group relative flex h-5 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-colors"
      >
        <span className="absolute inset-0 rounded-full bg-muted transition-colors group-hover:bg-emerald-500/10" />

        <span className="relative flex items-center gap-1 text-[10px] font-medium text-muted-foreground transition-colors group-hover:text-emerald-500">
          <Plus className="size-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
          {t("link")}
        </span>
      </button>
    )
  }

  const handleUnlink = async () => {
    setIsPending(true)

    const result = await unlinkProvider(provider)

    setIsPending(false)
    setConfirmOpen(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(
      t("unlinkSuccess", {
        provider: providerName,
      })
    )

    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="group relative flex h-5 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-colors"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500/10 transition-colors group-hover:bg-destructive/10" />

        <span className="relative text-[10px] font-medium text-emerald-500 transition-opacity duration-150 group-hover:opacity-0">
          {t("active")}
        </span>

        <span className="absolute inset-0 flex items-center justify-center gap-1 text-[10px] font-medium text-destructive opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <X className="size-3" />
          {t("unlink")}
        </span>
      </button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("unlinkTitle", {
                provider: providerName,
              })}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {t("unlinkDescription", {
                provider: providerName,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {tc("cancel")}
            </AlertDialogCancel>

            <AlertDialogAction onClick={handleUnlink} disabled={isPending}>
              {isPending ? t("unlinkPending") : t("unlink")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
