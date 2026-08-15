export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface StrengthScore {
  score: number; // 0 - 4
  status: PasswordStrength;
  label: string;
}

export function checkPasswordStrength(password: string): StrengthScore {
  if (!password) return { score: 0, status: 'weak', label: 'Пустой' };

  let score = 0;

  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, status: 'weak', label: 'Слабый' };
  if (score === 2) return { score, status: 'fair', label: 'Нормальный' };
  if (score === 3) return { score, status: 'good', label: 'Надёжный' };
  return { score, status: 'strong', label: 'Идеальный' };
}
