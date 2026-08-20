"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useMemo, useTransition } from "react"
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
  PasswordStrengthIndicator,
} from "@/shared/client/ui"

import {
  createChangePasswordSchema,
  type ChangePasswordValues,
} from "../model/schema"
import { changePassword } from "../api/change-password"

type ChangePasswordFormProps = { hasPassword: boolean }

export const ChangePasswordForm = ({
  hasPassword,
}: ChangePasswordFormProps) => {
  const [isPending, startTransition] = useTransition()
  const t = useTranslations("changePasswordForm")
  const tValidation = useTranslations("validation")

  const schema = useMemo(
    () => createChangePasswordSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: ChangePasswordValues) => {
    startTransition(async () => {
      try {
        const result = await changePassword(values)

        if (!result.success) {
          toast.error(result.error)
        }
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          typeof (err as any).digest === "string" &&
          (err as any).digest.startsWith("NEXT_REDIRECT")
        ) {
          throw err
        }

        toast.error(t("unexpectedError"))
      }
    })
  }

  const newPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {hasPassword && (
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("currentPassword")}</FormLabel>
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

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPassword")}</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <PasswordStrengthIndicator password={newPasswordValue} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending
            ? t("saving")
            : hasPassword
              ? t("changePassword")
              : t("setPassword")}
        </Button>
      </form>
    </Form>
  )
}
