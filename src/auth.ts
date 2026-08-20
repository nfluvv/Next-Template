import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { compare } from "bcrypt-ts"
import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"

import { prisma } from "@/shared/server/db/prisma"
import { createCredentialsSchema } from "@/entities/user"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { authConfig } from "@/auth.config"
import { generateUniqueUsername } from "@/entities/user/lib/generate-username"
import { verifyAutoLoginToken } from "@/shared/server/auth/auto-login-token"
import {
  decryptSecret,
  verifyBackupCode,
  verifyTotpCode,
} from "@/shared/server/auth/totp"
import { checkRateLimit } from "@/shared/server/security/rate-limit"
import { getClientIp } from "@/shared/server/lib/get-client-ip"
import { getTranslations } from "next-intl/server"

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token"

const getSessionUserId = async (): Promise<string | null> => {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!rawToken) return null

  try {
    const payload = await decode({
      token: rawToken,
      secret: process.env.AUTH_SECRET!,
      salt: SESSION_COOKIE_NAME,
    })
    return (payload?.id as string | undefined) ?? null
  } catch {
    return null
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: { email: {}, password: {}, totpCode: {} },
      authorize: async (raw) => {
        const ip = await getClientIp()
        const allowed = await checkRateLimit(`login:ip:${ip}`, {
          limit: 5,
          windowMs: 60_000,
        })
        if (!allowed) return null

        const t = await getTranslations("validation")
        const parsed = createCredentialsSchema(t).safeParse(raw)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        if (!user.emailVerified) return null

        if (user.twoFactorEnabled) {
          const totpCode = raw?.totpCode as string | undefined
          if (!totpCode) return null

          const validTotp =
            user.twoFactorSecret &&
            verifyTotpCode(decryptSecret(user.twoFactorSecret), totpCode)

          if (!validTotp) {
            const codeIndex = await verifyBackupCode(
              totpCode,
              user.twoFactorBackupCodes
            )
            if (codeIndex === -1) return null

            const remaining = user.twoFactorBackupCodes.filter(
              (_, i) => i !== codeIndex
            )
            await prisma.user.update({
              where: { id: user.id },
              data: { twoFactorBackupCodes: remaining },
            })
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    Credentials({
      id: "auto-login",
      name: "Auto Login",
      credentials: { token: {} },
      authorize: async (raw) => {
        const token = raw?.token as string | undefined
        if (!token) return null

        const userId = verifyAutoLoginToken(token)
        if (!userId) return null

        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.id) return
      const seed = user.email?.split("@")[0] ?? user.name ?? "user"
      const username = await generateUniqueUsername(seed)
      await prisma.user.update({
        where: { id: user.id },
        data: { username, emailVerified: user.emailVerified ?? new Date() },
      })
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ account }) {
      if (
        !account ||
        account.provider === "credentials" ||
        account.provider === "auto-login"
      ) {
        return true
      }

      return true
    },
    jwt: async ({ token, user, trigger }) => {
      if (user?.id) {
        token.id = user.id
      }

      if (token.id && (user || trigger === "update")) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            role: true,
            name: true,
            image: true,
          },
        })

        token.role = dbUser?.role
        token.name = dbUser?.name
        token.picture = dbUser?.image
      }

      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "USER" | "ADMIN"
        session.user.name = token.name ?? null
        session.user.image = token.picture ?? null
      }
      return session
    },
  },
})
