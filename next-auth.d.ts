import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string | null
    emailVerified?: Date | null
    role?: "USER" | "ADMIN"
  }
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
      username?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: "USER" | "ADMIN"
    username?: string | null
  }
}
