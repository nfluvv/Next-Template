import { describe, it, expect } from "vitest"

import {
  createCredentialsSchema,
  createUsernameSchema,
  createDeleteAccountSchema,
} from "./schema"

const t = (key: string) => key

const credentialsSchema = createCredentialsSchema(t)
const usernameSchema = createUsernameSchema(t)
const deleteAccountSchema = createDeleteAccountSchema(t)

describe("credentialsSchema", () => {
  it("принимает валидный email и пароль", () => {
    const result = credentialsSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    })

    expect(result.success).toBe(true)
  })

  it("отклоняет некорректный email", () => {
    const result = credentialsSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет слишком короткий пароль", () => {
    const result = credentialsSchema.safeParse({
      email: "test@example.com",
      password: "123",
    })

    expect(result.success).toBe(false)
  })
})

describe("usernameSchema", () => {
  it("принимает валидный юзернейм", () => {
    const result = usernameSchema.safeParse({
      username: "john_doe",
    })

    expect(result.success).toBe(true)
  })

  it("отклоняет юзернейм с заглавными буквами", () => {
    const result = usernameSchema.safeParse({
      username: "JohnDoe",
    })

    expect(result.success).toBe(false)
  })

  it("отклоняет слишком короткий юзернейм", () => {
    const result = usernameSchema.safeParse({
      username: "ab",
    })

    expect(result.success).toBe(false)
  })
})

describe("deleteAccountSchema", () => {
  it("требует точное слово DELETE для подтверждения", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: "delete",
    })

    expect(result.success).toBe(false)
  })

  it("проходит с правильным словом DELETE", () => {
    const result = deleteAccountSchema.safeParse({
      confirmation: "DELETE",
    })

    expect(result.success).toBe(true)
  })
})