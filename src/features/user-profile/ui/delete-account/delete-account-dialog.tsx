"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signOut } from "next-auth/react"
import { toast } from "react-hot-toast"

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
} from "@/shared/ui"
import { deleteAccountSchema, type DeleteAccountValues } from "@/entities/user"

import { deleteAccount } from "../../api/delete-account"

type DeleteAccountDialogProps = {
  hasPassword: boolean
  twoFactorEnabled: boolean
}

export const DeleteAccountDialog = ({
  hasPassword,
  twoFactorEnabled,
}: DeleteAccountDialogProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmation: "", password: "", totpCode: "" },
  })

  const onSubmit = async (values: DeleteAccountValues) => {
    const result = await deleteAccount(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Аккаунт удалён")
    setOpen(false)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Удалить аккаунт</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить аккаунт навсегда?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие необратимо. Все данные аккаунта будут удалены без
            возможности восстановления.
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
                    Введите{" "}
                    <code className="rounded bg-muted px-1">DELETE</code> для
                    подтверждения
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
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

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Отмена</AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Удаляем..."
                  : "Удалить навсегда"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
