import "server-only"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto"
import * as OTPAuth from "otpauth"
import { compare, hash } from "bcrypt-ts"

const ENCRYPTION_KEY = Buffer.from(
  process.env.TWO_FACTOR_ENCRYPTION_KEY || "",
  "hex"
)

export const encryptSecret = (plain: string) => {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv)
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()
  return `${iv.toString("hex")}.${authTag.toString("hex")}.${encrypted.toString("hex")}`
}

export const decryptSecret = (payload: string) => {
  const [ivHex, authTagHex, dataHex] = payload.split(".")
  const decipher = createDecipheriv(
    "aes-256-gcm",
    ENCRYPTION_KEY,
    Buffer.from(ivHex, "hex")
  )
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ])
  return decrypted.toString("utf8")
}

export const generateTotpSecret = (email: string) => {
  const secret = new OTPAuth.Secret({ size: 20 })

  const totp = new OTPAuth.TOTP({
    issuer: "NextTemplate",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  })

  return {
    base32Secret: secret.base32,
    otpauthUrl: totp.toString(),
  }
}

export const verifyTotpCode = (base32Secret: string, code: string) => {
  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  })

  const delta = totp.validate({ token: code, window: 1 })
  return delta !== null
}

export const generateBackupCodes = (count = 8) => {
  return Array.from({ length: count }, () => randomBytes(5).toString("hex")) // 10-символьные коды
}

export const hashBackupCodes = async (codes: string[]) => {
  return Promise.all(codes.map((code) => hash(code, 10)))
}

export const verifyBackupCode = async (code: string, hashedCodes: string[]) => {
  for (let i = 0; i < hashedCodes.length; i++) {
    if (await compare(code, hashedCodes[i])) {
      return i
    }
  }
  return -1
}
