import Link from "next/link"
import type { Control } from "react-hook-form"

import { siteConfig } from "@/shared/config/site"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/ui"

import type { LoginFormValues } from "../../model/schema"

type LoginFieldsProps = {
  control: Control<LoginFormValues>
}

export function LoginFields({ control }: LoginFieldsProps) {
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
              <FormLabel>Пароль</FormLabel>

              <Link
                href={siteConfig.routes.forgotPassword}
                className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              >
                Забыли пароль?
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
