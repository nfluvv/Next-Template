"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/ui"
import { emailSchema, type EmailValues } from "@/entities/user"

import { requestPasswordReset } from "../../api/request-password-reset"

export const ForgotPasswordForm = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const form = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: EmailValues) => {
    await requestPasswordReset(values)
    setSubmittedEmail(values.email)
  }

  if (submittedEmail) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Проверьте почту</h1>
        <p className="text-sm text-muted-foreground">
          Если аккаунт с {submittedEmail} существует, мы отправили на него
          ссылку для сброса пароля.
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-2 text-center text-2xl font-semibold">
        Восстановление пароля
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Введите email — мы отправим ссылку для сброса пароля.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
            {form.formState.isSubmitting ? "Отправляем..." : "Отправить ссылку"}
          </Button>
        </form>
      </Form>
    </>
  )
}
