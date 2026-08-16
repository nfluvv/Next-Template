import { z } from "zod"

import { credentialsSchema } from "@/entities/user/model/schema"

export const registerSchema = credentialsSchema
  .extend({
    name: z
      .string()
      .min(2, "Минимум 2 символа")
      .max(50, "Максимум 50 символов"),
    confirmPassword: z.string().min(8, "Минимум 8 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export {
  credentialsSchema as loginSchema,
  type Credentials as LoginFormValues,
} from "@/entities/user/model/schema"
