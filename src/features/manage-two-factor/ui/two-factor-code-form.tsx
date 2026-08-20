"use client"

import { useMemo } from "react"
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
import { createTotpCodeSchema, type TotpCodeValues } from "@/entities/user"

type TwoFactorCodeFormProps = {
  mode: "confirm" | "disable"
  onSubmit: (code: string) => Promise<void>
}

export function TwoFactorCodeForm({ mode, onSubmit }: TwoFactorCodeFormProps) {
  const t = useTranslations("twoFactor")
  const tValidation = useTranslations("validation")

  const schema = useMemo(() => createTotpCodeSchema(tValidation), [tValidation])

  const form = useForm<TotpCodeValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
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
            {t("disableDescription")}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{t("code")}</FormLabel>
                <FormControl>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder={t("codePlaceholder")}
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
              ? t("checking")
              : isDisable
                ? t("disable")
                : t("confirm")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
