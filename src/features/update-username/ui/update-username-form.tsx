"use client"

import { useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
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
import { createUsernameSchema, type UsernameValues } from "@/entities/user"

import { updateUsername } from "../api/update-username"

type UpdateUsernameFormProps = { defaultUsername: string }

export const UpdateUsernameForm = ({
  defaultUsername,
}: UpdateUsernameFormProps) => {
  const router = useRouter()

  const t = useTranslations("updateUsername")
  const tc = useTranslations("common")
  const tValidation = useTranslations("validation")

  const schema = useMemo(() => createUsernameSchema(tValidation), [tValidation])

  const form = useForm<UsernameValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: defaultUsername },
  })

  const username = useWatch({ control: form.control, name: "username" })

  const isSubmitting = form.formState.isSubmitting
  const isUnchanged = username === defaultUsername

  const onSubmit = async (values: UsernameValues) => {
    if (values.username === defaultUsername) return

    const result = await updateUsername(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(t("success"))
    router.refresh()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t("label")}</FormLabel>
              <FormControl>
                <Input placeholder={t("placeholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || isUnchanged}
          className="disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
        >
          {isSubmitting ? t("saving") : tc("save")}
        </Button>
      </form>
    </Form>
  )
}
