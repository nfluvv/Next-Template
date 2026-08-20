import { z } from "zod"

type T = (key: string) => string

export const createChangePasswordSchema = (t: T) => {
  const passwordField = z.string().min(8, t("passwordMin"))

  return z
    .object({
      currentPassword: z.string().optional(),
      newPassword: passwordField,
      confirmPassword: passwordField,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    })
}

type ChangePasswordSchema = ReturnType<typeof createChangePasswordSchema>
export type ChangePasswordValues = z.infer<ChangePasswordSchema>
