import { z } from "zod"

export const credentialsSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
})

export type Credentials = z.infer<typeof credentialsSchema>

export const nameSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(50, "Максимум 50 символов"),
})

export type NameValues = z.infer<typeof nameSchema>

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(20, "Максимум 20 символов")
    .regex(/^[a-z0-9_]+$/, "Только латиница, цифры и подчёркивание"),
})

export type UsernameValues = z.infer<typeof usernameSchema>

export const emailSchema = z.object({
  email: z.string().min(1, "Введите email").email("Некорректный email"),
})

export type EmailValues = z.infer<typeof emailSchema>

const newPasswordField = z.string().min(8, "Минимум 8 символов")

export const resetPasswordSchema = z
  .object({
    newPassword: newPasswordField,
    confirmPassword: newPasswordField,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

export const totpCodeSchema = z.object({
  code: z
    .string()
    .length(6, "Код должен состоять из 6 цифр")
    .regex(/^\d+$/, "Только цифры"),
})

export type TotpCodeValues = z.infer<typeof totpCodeSchema>

export const deleteAccountSchema = z
  .object({
    confirmation: z.string(),
    password: z.string().optional(),
    totpCode: z.string().optional(),
  })
  .refine((data) => data.confirmation === "DELETE", {
    message: "Введите DELETE для подтверждения",
    path: ["confirmation"],
  })

export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>

export const changeEmailSchema = z.object({
  newEmail: z.string().min(1, "Введите email").email("Некорректный email"),
  password: z.string().optional(),
  totpCode: z.string().optional(),
})

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>
