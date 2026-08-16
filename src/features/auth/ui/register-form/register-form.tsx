"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"

import { registerUser } from "@/features/auth/api/register-user"
import { Button, Form } from "@/shared/ui"

import { registerSchema, type RegisterFormValues } from "../../model/schema"
import { RegisterFields } from "./register-fields"
import { RegisterSuccess } from "./register-success"

export function RegisterForm() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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
            ? "Регистрируем..."
            : "Зарегистрироваться"}
        </Button>
      </form>
    </Form>
  )
}
