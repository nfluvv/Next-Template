export type PasswordStrength = "weak" | "fair" | "good" | "strong"

export interface StrengthScore {
  score: number // 0 - 4
  status: PasswordStrength
}

export function checkPasswordStrength(password: string): StrengthScore | null {
  if (!password) return null

  let score = 0

  if (password.length >= 8) score++
  if (/[0-9]/.test(password)) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, status: "weak" }
  if (score === 2) return { score, status: "fair" }
  if (score === 3) return { score, status: "good" }
  return { score, status: "strong" }
}
