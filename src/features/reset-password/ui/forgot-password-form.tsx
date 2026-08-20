"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { createEmailSchema, type EmailValues } from "@/entities/user"

import { requestPasswordReset } from "../api/request-password-reset"

export const ForgotPasswordForm = () => {
  const t = useTranslations("forgotPassword")
  const tc = useTranslations("common")
  const tValidation = useTranslations("validation")

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const schema = useMemo(() => createEmailSchema(tValidation), [tValidation])

  const form = useForm<EmailValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: EmailValues) => {
    await requestPasswordReset(values)
    setSubmittedEmail(values.email)
  }

  if (submittedEmail) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("titleEmailStep")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("resetLinkSent", { email: submittedEmail })}
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-center text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {t("description")}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tc("email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
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
            {form.formState.isSubmitting ? t("submitPending") : t("submit")}
          </Button>
        </form>
      </Form>
    </>
  )
}
