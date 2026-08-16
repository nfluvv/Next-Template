import { describe, it, expect } from "vitest"

import { encryptSecret, decryptSecret } from "./totp"

describe("encryptSecret / decryptSecret", () => {
  it("расшифровка возвращает исходную строку", () => {
    const original = "MYSECRETVALUE123"
    const encrypted = encryptSecret(original)
    const decrypted = decryptSecret(encrypted)

    expect(decrypted).toBe(original)
  })

  it("зашифрованное значение не совпадает с исходным", () => {
    const original = "MYSECRETVALUE123"
    const encrypted = encryptSecret(original)

    expect(encrypted).not.toBe(original)
  })

  it("каждый вызов даёт разный результат (случайный IV)", () => {
    const original = "MYSECRETVALUE123"
    const first = encryptSecret(original)
    const second = encryptSecret(original)

    expect(first).not.toBe(second)
  })
})
