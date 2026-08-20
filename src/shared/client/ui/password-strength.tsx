"use client"

import { useTranslations } from "next-intl"

import { checkPasswordStrength } from "../lib/password"

type PasswordStrengthIndicatorProps = {
  password?: string
}

export function PasswordStrengthIndicator({
  password = "",
}: PasswordStrengthIndicatorProps) {
  const t = useTranslations("passwordStrength")

  const strength = checkPasswordStrength(password)
  if (!strength) return null

  const { score, status } = strength

  const colorMap = {
    weak: "bg-destructive",
    fair: "bg-orange-500",
    good: "bg-amber-500",
    strong: "bg-emerald-500",
  }

  const textColorMap = {
    weak: "text-destructive",
    fair: "text-orange-500",
    good: "text-amber-500",
    strong: "text-emerald-500",
  }

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index < score
                ? colorMap[status]
                : "border border-border/20 bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-0.5">
        <span className="font-mono text-[9px] tracking-wider text-muted-foreground/70 uppercase">
          {t("label")}
        </span>
        <span
          className={`text-[10px] font-medium transition-colors duration-300 ${textColorMap[status]}`}
        >
          {t(status)}
        </span>
      </div>
    </div>
  )
}
