import { Link } from "@/shared/i18n/navigation"

import { getCurrentUser } from "@/entities/user/api/queries"
import { ThemeToggle } from "@/features/toggle-theme"
import { LanguageSwitcher } from "@/features/switch-locale"
import { siteConfig } from "@/shared/client/config/site"
import { buttonVariants, Container } from "@/shared/client/ui"
import { getTranslations } from "next-intl/server"
import { UserMenu } from "./UserMenu"

export async function Header() {
  const user = await getCurrentUser()
  const t = await getTranslations("Auth")

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <Container className="flex flex-wrap items-center justify-between gap-1.5 gap-x-4 gap-y-2 py-2.5 sm:h-16 sm:py-0">
        <Link
          href={siteConfig.routes.home}
          className="font-display shrink-0 text-base font-semibold sm:text-lg"
        >
          {siteConfig.name}
        </Link>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          <div className="mx-1 h-5 w-px bg-border sm:mx-2" />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <Link
                href={siteConfig.routes.login}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {t("login")}
              </Link>
              <Link
                href={siteConfig.routes.register}
                className={buttonVariants({ size: "sm" })}
              >
                {t("register")}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
