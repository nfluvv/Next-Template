"use client"

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
import { totpCodeSchema, type TotpCodeValues } from "@/entities/user"

type TwoFactorCodeFormProps = {
  mode: "confirm" | "disable"
  onSubmit: (code: string) => Promise<void>
}

export function TwoFactorCodeForm({ mode, onSubmit }: TwoFactorCodeFormProps) {
  const form = useForm<TotpCodeValues>({
    resolver: zodResolver(totpCodeSchema),
    defaultValues: {
      code: "",
    },
  })

  const handleSubmit = async (values: TotpCodeValues) => {
    await onSubmit(values.code)
    form.reset()
  }

  const isDisable = mode === "disable"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {isDisable && (
          <p className="text-sm leading-6 text-muted-foreground">
            Двухфакторная аутентификация включена. Чтобы отключить её,
            подтвердите действие кодом из приложения.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Код из приложения</FormLabel>

                <FormControl>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={isDisable ? "destructive" : "default"}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Проверяем..."
              : isDisable
                ? "Отключить"
                : "Подтвердить"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
