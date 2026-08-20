"use client"

import { Link } from "@/shared/i18n/navigation"
import { ChevronDown } from "lucide-react"

import { SignOutButton } from "@/features/sign-out"
import { siteConfig } from "@/shared/client/config/site"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/client/ui"

import { useTranslations } from "next-intl"

type UserMenuProps = {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    username?: string | null
    role: "USER" | "ADMIN"
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const initial = (user.name ?? user.email)?.charAt(0).toUpperCase()
  const t = useTranslations("userMenu")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <Avatar className="size-7 rounded-md">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? ""}
              className="rounded-md object-cover"
            />
            <AvatarFallback className="rounded-md bg-muted text-[11px] font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="max-w-28 truncate text-xs leading-none font-semibold">
              {user.name ?? "Без имени"}
            </p>

            {user.username && (
              <p className="mt-1 max-w-28 truncate font-mono text-[9px] leading-none text-muted-foreground">
                @{user.username}
              </p>
            )}
          </div>

          <ChevronDown className="hidden size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl border-border/70 p-1.5"
      >
        <div className="px-2.5 py-2.5">
          <div className="flex items-center gap-3">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? ""}
                className="rounded-lg object-cover"
              />
              <AvatarFallback className="rounded-lg bg-muted font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user.name ?? "Без имени"}
              </p>

              <p className="truncate font-mono text-[10px] text-muted-foreground">
                {user.username ? `@${user.username}` : user.email}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href={
              user.username
                ? `/users/${user.username}`
                : siteConfig.routes.settings
            }
          >
            {t("myProfile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={siteConfig.routes.settings}>{t("settings")}</Link>
        </DropdownMenuItem>

        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href={siteConfig.routes.admin}>{t("admin")}</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
