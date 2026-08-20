"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import { registerUser } from "../../api/register-user"
import { Button, Form } from "@/shared/client/ui"

import {
  createRegisterSchema,
  type RegisterFormValues,
} from "../../model/schema"
import { RegisterFields } from "./register-fields"
import { RegisterSuccess } from "./register-success"

export function RegisterForm() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

  const t = useTranslations("Auth")
  const tValidation = useTranslations("validation")

  const schema = useMemo(() => createRegisterSchema(tValidation), [tValidation])

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerUser(values)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setRegisteredEmail(values.email)
  }

  if (registeredEmail) {
    return <RegisterSuccess email={registeredEmail} />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RegisterFields control={form.control} />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting
            ? t("toRegisterPending")
            : t("toRegister")}
        </Button>
      </form>
    </Form>
  )
}
