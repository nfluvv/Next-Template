import "server-only"

import { prisma } from "@/shared/server/db/prisma"

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 20) || "user"

export const generateUniqueUsername = async (seed: string) => {
  const base = slugify(seed)
  let candidate = base
  let attempt = 0

  while (
    await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })
  ) {
    attempt += 1
    candidate = `${base}-${attempt}`
  }

  return candidate
}
