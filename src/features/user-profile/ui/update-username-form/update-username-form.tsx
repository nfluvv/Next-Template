"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

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
import { usernameSchema, type UsernameValues } from "@/entities/user"

import { updateUsername } from "../../api/update-username"

type UpdateUsernameFormProps = {
  defaultUsername: string
}

export const UpdateUsernameForm = ({
  defaultUsername,
}: UpdateUsernameFormProps) => {
  const router = useRouter()

  const form = useForm<UsernameValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: defaultUsername },
  })

  const onSubmit = async (values: UsernameValues) => {
    const result = await updateUsername(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Юзернейм обновлён")
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
              <FormLabel>Юзернейм</FormLabel>
              <FormControl>
                <Input placeholder="john_doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Сохраняем..." : "Сохранить"}
        </Button>
      </form>
    </Form>
  )
}
