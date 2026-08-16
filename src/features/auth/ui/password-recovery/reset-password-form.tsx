"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

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
} from "@/shared/ui"
import { resetPasswordSchema, type ResetPasswordValues } from "@/entities/user"

import { resetPassword } from "../../api/reset-password"

type ResetPasswordFormProps = {
  token: string
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter()
  const [isDone, setIsDone] = useState(false)

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onSubmit = async (values: ResetPasswordValues) => {
    const result = await resetPassword(token, values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setIsDone(true)
    toast.success("Пароль обновлён")
    setTimeout(() => router.push("/login"), 1500)
  }

  const newPasswordValue = useWatch({
    control: form.control,
    name: "newPassword",
  })

  if (isDone) {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Пароль обновлён</h1>
        <p className="text-sm text-muted-foreground">
          Переносим вас на страницу входа...
        </p>
      </div>
    )
  }

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-semibold">Новый пароль</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
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
                <FormLabel>Повторите пароль</FormLabel>
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
            {form.formState.isSubmitting ? "Сохраняем..." : "Сохранить пароль"}
          </Button>
        </form>
      </Form>
    </>
  )
}
