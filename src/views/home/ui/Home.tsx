import Link from "next/link"

import { siteConfig } from "@/shared/config/site"
import { buttonVariants } from "@/shared/ui/shadcn/button"
import { auth } from "@/shared/config/auth"
import { Container } from "@/shared/ui"

export async function HomePage() {
  const session = await auth()
  const isUserLoggedIn = Boolean(session?.user)

  return (
    <Container className="container flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-6 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        {siteConfig.name}
      </h1>
      <p className="max-w-md text-muted-foreground">
        Next.js + Feature-Sliced Design + Auth.js + Prisma/Postgres + Zod +
        React Hook Form - всё уже настроено, начинай писать фичи.
      </p>
      <div className="flex gap-3">
        {!isUserLoggedIn && (
          <>
            <Link
              href={siteConfig.routes.register}
              className={buttonVariants({ variant: "default" })}
            >
              Начать
            </Link>

            <Link
              href={siteConfig.routes.login}
              className={buttonVariants({ variant: "outline" })}
            >
              Войти
            </Link>
          </>
        )}
      </div>
    </Container>
  )
}
