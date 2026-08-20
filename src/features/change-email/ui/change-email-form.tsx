"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/client/ui"
import {
  createChangeEmailSchema,
  type ChangeEmailValues,
} from "@/entities/user"

import { requestEmailChange } from "../api/change-email"

type ChangeEmailFormProps = {
  currentEmail: string
  hasPassword: boolean
  twoFactorEnabled: boolean
}

export const ChangeEmailForm = ({
  currentEmail,
  hasPassword,
  twoFactorEnabled,
}: ChangeEmailFormProps) => {
  const t = useTranslations("changeEmail")
  const tValidation = useTranslations("validation")

  const schema = useMemo(
    () => createChangeEmailSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(schema),
    defaultValues: { newEmail: "", password: "", totpCode: "" },
  })

  const onSubmit = async (values: ChangeEmailValues) => {
    const result = await requestEmailChange(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(t("success"))

    form.reset({ newEmail: "", password: "", totpCode: "" })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs text-muted-foreground">
          {t("currentEmail", { email: currentEmail })}
        </p>

        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newEmail")}</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasPassword && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {twoFactorEnabled && (
          <FormField
            control={form.control}
            name="totpCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("twoFactorCode")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("totpPlaceholder")}
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t("submitPending") : t("submit")}
        </Button>
      </form>
    </Form>
  )
}
