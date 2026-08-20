import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

import { siteConfig } from "@/shared/client/config/site"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
} from "@/shared/client/ui"

import { ProfileCover } from "./ProfileCover"
import { ProfileIdentity } from "./ProfileIdentity"

type UserProfileProps = {
  profile: {
    id: string
    name: string | null
    username: string | null
    image: string | null
    createdAt: Date
  }
  isOwnProfile: boolean
}

export function UserProfile({ profile, isOwnProfile }: UserProfileProps) {
  const t = useTranslations("profile")
  const locale = useLocale()

  const initial = (profile.name ?? "?").charAt(0).toUpperCase()

  const joinedDate = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(profile.createdAt)

  return (
    <Card className="mt-2 overflow-hidden border-border/60 bg-background shadow-none">
      <ProfileCover />

      <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Avatar className="-mt-10 size-24 shrink-0 rounded-2xl border-4 border-background bg-background sm:-mt-12 sm:size-28">
            <AvatarImage
              src={profile.image ?? undefined}
              alt={profile.name ?? ""}
              className="rounded-xl object-cover"
            />

            <AvatarFallback className="rounded-xl bg-muted text-3xl font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>

          {isOwnProfile && (
            <Link href={siteConfig.routes.settings}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-5 font-medium"
              >
                {t("edit")}
              </Button>
            </Link>
          )}
        </div>

        <ProfileIdentity name={profile.name} username={profile.username} />

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span>
            {t("memberSince")}{" "}
            <span className="font-medium text-foreground/80">{joinedDate}</span>
          </span>

          <span className="hidden text-border sm:inline">•</span>

          <span className="font-mono text-[10px] tracking-wide text-muted-foreground/60">
            {siteConfig.name}
          </span>
        </div>

        <div className="mt-6 border-t border-border/60 pt-5">
          <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] text-muted-foreground/50 uppercase">
            <span>Profile</span>
            <span className="h-px flex-1 bg-border/60" />
            <span>{profile.username}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
