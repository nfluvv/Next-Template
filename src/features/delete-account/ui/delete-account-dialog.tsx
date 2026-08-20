"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signOut } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/client/ui"
import {
  createDeleteAccountSchema,
  type DeleteAccountValues,
} from "@/entities/user"

import { deleteAccount } from "../api/delete-account"

type DeleteAccountDialogProps = {
  hasPassword: boolean
  twoFactorEnabled: boolean
}

export const DeleteAccountDialog = ({
  hasPassword,
  twoFactorEnabled,
}: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState(false)

  const t = useTranslations("deleteAccount")
  const tc = useTranslations("common")
  const tValidation = useTranslations("validation")

  const schema = useMemo(
    () => createDeleteAccountSchema(tValidation),
    [tValidation]
  )

  const form = useForm<DeleteAccountValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      confirmation: "",
      password: "",
      totpCode: "",
    },
  })

  const onSubmit = async (values: DeleteAccountValues) => {
    const result = await deleteAccount(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(t("success"))
    setOpen(false)

    await signOut({
      callbackUrl: "/",
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{t("deleteAccountLabel")}</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteAccountTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteAccountDesc")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("confirmationPrefix")}{" "}
                    <code className="rounded bg-muted px-1">
                      {t("confirmationWord")}
                    </code>{" "}
                    {t("confirmationSuffix")}
                  </FormLabel>

                  <FormControl>
                    <Input {...field} autoComplete="off" />
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
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        autoComplete="new-password"
                      />
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
                    <FormLabel>{t("twoFactorCode")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("totpPlaceholder")}
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <AlertDialogFooter>
              <AlertDialogCancel type="button">
                {tc("cancel")}
              </AlertDialogCancel>

              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? t("deletePending") : t("delete")}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
