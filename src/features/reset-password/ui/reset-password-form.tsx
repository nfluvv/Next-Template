"use client"

import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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
  PasswordStrengthIndicator,
} from "@/shared/client/ui"
import {
  createResetPasswordSchema,
  type ResetPasswordValues,
} from "@/entities/user"

import { resetPassword } from "../api/reset-password"

type ResetPasswordFormProps = { token: string }

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter()
  const t = useTranslations("resetPassword")
  const tValidation = useTranslations("validation")
  const [isDone, setIsDone] = useState(false)

  const schema = useMemo(
    () => createResetPasswordSchema(tValidation),
    [tValidation]
  )

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    const result = await resetPassword(token, values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setIsDone(true)
    toast.success(t("successTitle"))
    setTimeout(() => router.push("/login"), 1500)
  }

  const newPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  })

  if (isDone) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("successTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("successDescription")}
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-semibold">{t("title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? t("saving") : t("submit")}
          </Button>
        </form>
      </Form>
    </>
  )
}
