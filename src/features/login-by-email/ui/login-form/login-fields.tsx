import Link from "next/link"
import type { Control } from "react-hook-form"

import { siteConfig } from "@/shared/client/config/site"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/client/ui"

import type { LoginFormValues } from "../../model/schema"

import { useTranslations } from "next-intl"

type LoginFieldsProps = {
  control: Control<LoginFormValues>
}

export function LoginFields({ control }: LoginFieldsProps) {
  const t = useTranslations("Auth")

  return (
    <>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" {...field} />
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
            <div className="flex items-center justify-between">
              <FormLabel>{t("password")}</FormLabel>

              <Link
                href={siteConfig.routes.forgotPassword}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <FormControl>
              <Input type="password" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
