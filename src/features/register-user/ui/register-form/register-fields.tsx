"use client"

import type { Control } from "react-hook-form"
import { useWatch } from "react-hook-form"
import { PasswordStrengthIndicator } from "@/shared/client/ui"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/client/ui"

import type { RegisterFormValues } from "../../model/schema"

import { useTranslations } from "next-intl"

type RegisterFieldsProps = {
  control: Control<RegisterFormValues>
}

export function RegisterFields({ control }: RegisterFieldsProps) {
  const t = useTranslations("Auth")

  const passwordValue = useWatch({
    control,
    name: "password",
  })

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-semibold">
        {t("register")}
      </h1>

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Name")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("NameExample")}
                autoComplete="name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("password")}</FormLabel>
            <FormControl>
              <Input type="password" autoComplete="new-password" {...field} />
            </FormControl>

            <PasswordStrengthIndicator password={passwordValue} />

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("passwordRepeat")}</FormLabel>
            <FormControl>
              <Input type="password" autoComplete="new-password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
