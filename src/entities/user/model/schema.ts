import { z } from "zod"

type T = (key: string) => string

export const createCredentialsSchema = (t: T) =>
  z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(8, t("passwordMin")),
  })

type CredentialsSchema = ReturnType<typeof createCredentialsSchema>
export type Credentials = z.infer<CredentialsSchema>

export const createNameSchema = (t: T) =>
  z.object({
    name: z.string().min(2, t("nameMin")).max(50, t("nameMax")),
  })

type NameSchema = ReturnType<typeof createNameSchema>
export type NameValues = z.infer<NameSchema>

export const createUsernameSchema = (t: T) =>
  z.object({
    username: z
      .string()
      .min(3, t("usernameMin"))
      .max(20, t("usernameMax"))
      .regex(/^[a-z0-9_]+$/, t("usernameFormat")),
  })

type UsernameSchema = ReturnType<typeof createUsernameSchema>
export type UsernameValues = z.infer<UsernameSchema>

export const createEmailSchema = (t: T) =>
  z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
  })

type EmailSchema = ReturnType<typeof createEmailSchema>
export type EmailValues = z.infer<EmailSchema>

export const createResetPasswordSchema = (t: T) => {
  const passwordField = z.string().min(8, t("passwordMin"))

  return z
    .object({
      newPassword: passwordField,
      confirmPassword: passwordField,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    })
}

type ResetPasswordSchema = ReturnType<typeof createResetPasswordSchema>
export type ResetPasswordValues = z.infer<ResetPasswordSchema>

export const createTotpCodeSchema = (t: T) =>
  z.object({
    code: z
      .string()
      .length(6, t("codeLength"))
      .regex(/^\d+$/, t("codeDigitsOnly")),
  })

type TotpCodeSchema = ReturnType<typeof createTotpCodeSchema>
export type TotpCodeValues = z.infer<TotpCodeSchema>

export const createDeleteAccountSchema = (t: T) =>
  z
    .object({
      confirmation: z.string(),
      password: z.string().optional(),
      totpCode: z.string().optional(),
    })
    .refine((data) => data.confirmation === "DELETE", {
      message: t("deleteConfirmation"),
      path: ["confirmation"],
    })

type DeleteAccountSchema = ReturnType<typeof createDeleteAccountSchema>
export type DeleteAccountValues = z.infer<DeleteAccountSchema>

export const createChangeEmailSchema = (t: T) =>
  z.object({
    newEmail: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().optional(),
    totpCode: z.string().optional(),
  })

type ChangeEmailSchema = ReturnType<typeof createChangeEmailSchema>
export type ChangeEmailValues = z.infer<ChangeEmailSchema>
