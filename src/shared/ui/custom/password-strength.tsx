'use client';

import { checkPasswordStrength } from '@/shared/lib/password';

type PasswordStrengthIndicatorProps = {
  password?: string;
};

export function PasswordStrengthIndicator({ password = '' }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, status, label } = checkPasswordStrength(password);

  const colorMap = {
    weak: 'bg-destructive',
    fair: 'bg-orange-500',
    good: 'bg-amber-500',
    strong: 'bg-emerald-500',
  };

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index < score ? colorMap[status] : 'bg-muted border border-border/20'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between items-center px-0.5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
          Сложность пароля
        </span>
        <span className={`font-medium text-[10px] transition-colors duration-300 ${
          status === 'weak' ? 'text-destructive' : 
          status === 'fair' ? 'text-orange-500' : 
          status === 'good' ? 'text-amber-500' : 'text-emerald-500'
        }`}>
          {label}
        </span>
      </div>
    </div>
  );
}
