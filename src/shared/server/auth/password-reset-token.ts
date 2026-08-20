import "server-only"
import { randomBytes } from "crypto"

import { prisma } from "@/shared/server/db/prisma"

const TOKEN_TTL_MS = 1000 * 60 * 60
const identifierFor = (email: string) => `reset:${email}`

export const createPasswordResetToken = async (email: string) => {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + TOKEN_TTL_MS)
  const identifier = identifierFor(email)

  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  })

  return token
}

export const consumePasswordResetToken = async (token: string) => {
  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record) return null

  await prisma.verificationToken.delete({ where: { token } })

  if (record.expires < new Date()) return null
  if (!record.identifier.startsWith("reset:")) return null // защита от подмены типа токена

  return record.identifier.replace("reset:", "")
}
