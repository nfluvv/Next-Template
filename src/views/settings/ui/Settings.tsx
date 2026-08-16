import { auth } from "@/shared/config/auth"
import { getCurrentUser, hasPassword } from "@/entities/user/api/queries"
import { ProfileSettings } from "@/widgets/profile-settings"
import { Container } from "@/shared/ui"

export async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await getCurrentUser()
  if (!user) return null

  const userHasPassword = await hasPassword(user.id)

  return (
    <Container className="py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 sm:mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[9px] font-semibold tracking-[0.25em] text-muted-foreground/60 uppercase">
              01 / ACCOUNT
            </span>
            <span className="h-px w-8 bg-border" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Настройки
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Управляйте информацией профиля и настройками аккаунта.
          </p>
        </div>

        <ProfileSettings user={user} userHasPassword={userHasPassword} />

        <div className="mt-5 flex items-center justify-between px-1">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">
            ACCOUNT SETTINGS
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
            01
          </span>
        </div>
      </div>
    </Container>
  )
}
