import { z } from "zod"

const passwordField = z.string().min(8, "Минимум 8 символов")

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    newPassword: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
