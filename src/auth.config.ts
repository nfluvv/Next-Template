import type { NextAuthConfig } from "next-auth"

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forbidden",
  "/verify-email",
  "/forgot-password",
  "/users",
  "/reset-password",
  "/confirm-email-change",
]

type CheckAuthorizationParams = {
  isLoggedIn: boolean
  role?: "USER" | "ADMIN"
  pathname: string
  baseUrl: string
}

export function checkAuthorization({
  isLoggedIn,
  role,
  pathname,
  baseUrl,
}: CheckAuthorizationParams): true | Response {
  const isHomePage = pathname === "/"

  const isPublicRoute =
    isHomePage || PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  const isAdminRoute = pathname.startsWith("/admin")

  if (isAdminRoute) {
    if (role !== "ADMIN") {
      return Response.redirect(`${baseUrl}/forbidden?reason=forbidden`)
    }

    return true
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(`${baseUrl}/forbidden?reason=unauthenticated`)
  }

  return true
}

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/",
  },

  session: {
    strategy: "jwt",
  },

  providers: [],

  callbacks: {
    authorized() {
      return true
    },
  },
} satisfies NextAuthConfig
