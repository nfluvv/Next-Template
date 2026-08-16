"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
} from "@/shared/ui"
import { changeEmailSchema, type ChangeEmailValues } from "@/entities/user"

import { requestEmailChange } from "../../api/change-email"

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
  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: "", password: "", totpCode: "" },
  })

  const onSubmit = async (values: ChangeEmailValues) => {
    const result = await requestEmailChange(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Письмо с подтверждением отправлено на новый адрес")
    form.reset({ newEmail: "", password: "", totpCode: "" })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Текущий email: {currentEmail}
        </p>

        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
                <FormLabel>Код из приложения</FormLabel>
                <FormControl>
                  <Input placeholder="123456" maxLength={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Отправляем..." : "Изменить email"}
        </Button>
      </form>
    </Form>
  )
}
