"use server"

import { compare } from "bcrypt-ts"
import { getTranslations } from "next-intl/server"

import { prisma } from "@/shared/server/db/prisma"
import { createCredentialsSchema } from "@/entities/user"

type LoginStep =
  | { step: "invalid" }
  | { step: "unverified" }
  | { step: "needs-2fa" }
  | { step: "ok" }

export const checkLoginStep = async (raw: unknown): Promise<LoginStep> => {
  const t = await getTranslations("validation")
  const parsed = createCredentialsSchema(t).safeParse(raw)
  if (!parsed.success) return { step: "invalid" }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })
  if (!user?.passwordHash) return { step: "invalid" }

  const isValid = await compare(parsed.data.password, user.passwordHash)
  if (!isValid) return { step: "invalid" }

  if (!user.emailVerified) return { step: "unverified" }
  if (user.twoFactorEnabled) return { step: "needs-2fa" }

  return { step: "ok" }
}
