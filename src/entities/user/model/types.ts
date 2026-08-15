export const USER_ROLES = ["USER", "ADMIN"] as const
export type UserRole = (typeof USER_ROLES)[number]

export type User = {
  id: string
  email: string
  name: string | null
  image: string | null
  username: string | null
  role: UserRole
  twoFactorEnabled: boolean
}
