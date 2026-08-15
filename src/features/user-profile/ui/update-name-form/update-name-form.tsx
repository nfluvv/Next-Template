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
import { nameSchema, type NameValues } from "@/entities/user"

import { updateName } from "../../api/update-name"

type UpdateNameFormProps = {
  defaultName: string
}

export const UpdateNameForm = ({ defaultName }: UpdateNameFormProps) => {
  const router = useRouter()

  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: defaultName },
  })

  const onSubmit = async (values: NameValues) => {
    const result = await updateName(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Имя обновлено")
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
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input {...field} />
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
