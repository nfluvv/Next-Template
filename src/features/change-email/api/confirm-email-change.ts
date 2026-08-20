"use server"

import { redirect } from "next/navigation"

import { prisma } from "@/shared/server/db/prisma"
import { consumeEmailChangeToken } from "../lib/email-change-token"

export async function confirmEmailChangeToken(token: string) {
  const result = await consumeEmailChangeToken(token)

  if (!result) {
    redirect("/confirm-email-change/invalid")
  }

  const { userId, newEmail } = result

  const existing = await prisma.user.findUnique({
    where: { email: newEmail },
    select: { id: true },
  })
  if (existing) {
    redirect("/confirm-email-change/invalid")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail, emailVerified: new Date() },
  })

  redirect("/settings?emailChanged=1")
}
