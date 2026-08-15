import type { NextAuthConfig } from "next-auth"

const PUBLIC_ROUTES = ['/login', '/register', '/forbidden', '/verify-email', '/forgot-password', '/reset-password', '/confirm-email-change']

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const { pathname, origin } = request.nextUrl

      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
      )
      const isAdminRoute = pathname.startsWith("/admin")

      if (isAdminRoute) {
        if (auth?.user.role !== "ADMIN") {
          return Response.redirect(`${origin}/forbidden?reason=forbidden`)
        }
        return true
      }

      if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(`${origin}/forbidden?reason=unauthenticated`)
      }

      return true
    },
  },
} satisfies NextAuthConfig
