import "server-only"
import { randomBytes } from "crypto"

import { prisma } from "@/shared/server/db/prisma"

const TOKEN_TTL_MS = 1000 * 60 * 60 // 1h
const identifierFor = (userId: string) => `email-change:${userId}`

export const createEmailChangeToken = async (
  userId: string,
  newEmail: string
) => {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + TOKEN_TTL_MS)
  const identifier = identifierFor(userId)

  await prisma.verificationToken.deleteMany({ where: { identifier } })
  await prisma.verificationToken.create({
    data: { identifier: `${identifier}::${newEmail}`, token, expires },
  })

  return token
}

export const consumeEmailChangeToken = async (token: string) => {
  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record) return null

  await prisma.verificationToken.delete({ where: { token } })
  if (record.expires < new Date()) return null

  const match = record.identifier.match(/^email-change:(.+)::(.+)$/)
  if (!match) return null

  const [, userId, newEmail] = match
  return { userId, newEmail }
}
