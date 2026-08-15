"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

import { checkLoginStep } from "@/features/auth/api/check-login-step"
import { requestVerificationEmail } from "@/features/auth/api/email-verification"
import { Button, Form } from "@/shared/ui"

import { LoginFields } from "./login-fields"
import { LoginTwoFactor } from "./login-2fa"
import { LoginVerification } from "./login-verification"
import { loginSchema, type LoginFormValues } from "../../model/schema"
import { OAuthButtons } from "../oauth-buttons/oauth-buttons"

export function LoginForm() {
  const router = useRouter()

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false)
  const [totpCode, setTotpCode] = useState("")
  const [isResending, setIsResending] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSuccess = () => {
    router.push("/")
    router.refresh()
  }

  const onSubmit = async (values: LoginFormValues) => {
    setUnverifiedEmail(null)

    if (needsTwoFactor) {
      const result = await signIn("credentials", {
        ...values,
        totpCode,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Неверный код")
        return
      }

      handleSuccess()
      return
    }

    const check = await checkLoginStep(values)

    if (check.step === "invalid") {
      toast.error("Неверный email или пароль")
      return
    }

    if (check.step === "unverified") {
      setUnverifiedEmail(values.email)
      return
    }

    if (check.step === "needs-2fa") {
      setNeedsTwoFactor(true)
      return
    }

    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    })

    if (result?.error) {
      toast.error("Неверный email или пароль")
      return
    }

    handleSuccess()
  }

  const handleResend = async () => {
    if (!unverifiedEmail) return

    setIsResending(true)

    try {
      await requestVerificationEmail(unverifiedEmail)
      toast.success("Письмо отправлено, проверьте почту")
    } finally {
      setIsResending(false)
    }
  }

  if (needsTwoFactor) {
    return (
      <LoginTwoFactor
        code={totpCode}
        onCodeChange={setTotpCode}
        onSubmit={() => form.handleSubmit(onSubmit)()}
        isSubmitting={form.formState.isSubmitting}
      />
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <LoginFields control={form.control} />

        <LoginVerification
          email={unverifiedEmail}
          isResending={isResending}
          onResend={handleResend}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Входим..." : "Войти"}
        </Button>

        <OAuthButtons />
      </form>
    </Form>
  )
}