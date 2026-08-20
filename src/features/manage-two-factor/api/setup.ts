"use server"

import { auth } from "@/auth"
import { prisma } from "@/shared/server/db/prisma"
import {
  generateTotpSecret,
  encryptSecret,
  decryptSecret,
  verifyTotpCode,
  generateBackupCodes,
  hashBackupCodes,
} from "@/shared/server/auth/totp"
import QRCode from "qrcode"

type InitiateResult =
  | { success: true; qrCodeDataUrl: string; secret: string }
  | { success: false; error: string }

export const initiateTwoFactorSetup = async (): Promise<InitiateResult> => {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const { base32Secret, otpauthUrl } = generateTotpSecret(session.user.email!)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: encryptSecret(base32Secret) },
  })

  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl)

  return { success: true, qrCodeDataUrl, secret: base32Secret }
}

type ConfirmResult =
  { success: true; backupCodes: string[] } | { success: false; error: string }

export const confirmTwoFactorSetup = async (
  code: string
): Promise<ConfirmResult> => {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true },
  })

  if (!user?.twoFactorSecret) {
    return { success: false, error: "Please start the 2FA setup first" }
  }

  const isValid = verifyTotpCode(decryptSecret(user.twoFactorSecret), code)
  if (!isValid) {
    return { success: false, error: "Invalid code" }
  }

  const backupCodes = generateBackupCodes()
  const hashedCodes = await hashBackupCodes(backupCodes)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: true, twoFactorBackupCodes: hashedCodes },
  })

  return { success: true, backupCodes }
}

type DisableResult = { success: true } | { success: false; error: string }

export const disableTwoFactor = async (
  code: string
): Promise<DisableResult> => {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true },
  })

  if (!user?.twoFactorSecret) {
    return { success: false, error: "2FA is not enabled" }
  }

  const isValid = verifyTotpCode(decryptSecret(user.twoFactorSecret), code)
  if (!isValid) {
    return { success: false, error: "Invalid code" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    },
  })

  return { success: true }
}
