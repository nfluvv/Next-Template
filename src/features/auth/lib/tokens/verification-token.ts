import "server-only"
import { randomBytes } from "crypto"

import { prisma } from "@/shared/api/prisma"

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24

export const createVerificationToken = async (email: string) => {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + TOKEN_TTL_MS)

  await prisma.verificationToken.deleteMany({ where: { identifier: email } })

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  })

  return token
}

export const consumeVerificationToken = async (token: string) => {
  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record) return null

  await prisma.verificationToken.delete({ where: { token } })

  if (record.expires < new Date()) return null

  return record.identifier
}
