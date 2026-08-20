import { z } from "zod"

import { createCredentialsSchema } from "@/entities/user"

type T = (key: string) => string

export const createRegisterSchema = (t: T) =>
  createCredentialsSchema(t)
    .extend({
      name: z.string().min(2, t("nameMin")).max(50, t("nameMax")),
      confirmPassword: z.string().min(8, t("passwordMin")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    })

type RegisterSchema = ReturnType<typeof createRegisterSchema>
export type RegisterFormValues = z.infer<RegisterSchema>
