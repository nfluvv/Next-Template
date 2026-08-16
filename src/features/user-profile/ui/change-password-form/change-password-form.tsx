"use client"

import { useForm, useWatch } from "react-hook-form"
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
  PasswordStrengthIndicator,
} from "@/shared/ui"

import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../../model/schema"
import { changePassword } from "../../api/change-password"

type ChangePasswordFormProps = {
  hasPassword: boolean
}

export const ChangePasswordForm = ({
  hasPassword,
}: ChangePasswordFormProps) => {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ChangePasswordValues) => {
    const result = await changePassword(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(hasPassword ? "Пароль изменён" : "Пароль установлен")
    form.reset({ currentPassword: "", newPassword: "", confirmPassword: "" })
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
                <FormLabel>Текущий пароль</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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
              <FormLabel>Повторите новый пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Сохраняем..."
            : hasPassword
              ? "Изменить пароль"
              : "Установить пароль"}
        </Button>
      </form>
    </Form>
  )
}
