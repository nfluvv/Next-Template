import Link from "next/link"

import { getCurrentUser } from "@/entities/user/api/queries"
import { ThemeToggle } from "@/features/theme"
import { siteConfig } from "@/shared/config/site"
import { buttonVariants, Container } from "@/shared/ui"
import { UserMenu } from "./UserMenu"

export async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href={siteConfig.routes.home}
          className="font-display text-lg font-semibold"
        >
          {siteConfig.name}
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu user={user} />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={siteConfig.routes.login}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Войти
            </Link>
            <Link
              href={siteConfig.routes.register}
              className={buttonVariants({ size: "sm" })}
            >
              Регистрация
            </Link>
          </div>
        )}
      </Container>
    </header>
  )
}
