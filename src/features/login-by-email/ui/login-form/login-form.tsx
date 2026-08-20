"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import { checkLoginStep } from "@/features/login-by-email/api/check-login-step"
import { requestVerificationEmail } from "@/features/verify-email/api/email-verification"
import { Button, Form } from "@/shared/client/ui"

import { LoginFields } from "./login-fields"
import { LoginTwoFactor } from "./login-2fa"
import { LoginVerification } from "./login-verification"
import { OAuthButtons } from "../oauth-buttons/oauth-buttons"
import { loginSchema, type LoginFormValues } from "../../model/schema"

type AuthStep = "credentials" | "unverified" | "2fa"

export function LoginForm() {
  const router = useRouter()
  const t = useTranslations("Auth")
  const tLogin = useTranslations("loginForm")
  const tValidation = useTranslations("validation")

  const [step, setStep] = useState<AuthStep>("credentials")
  const [totpCode, setTotpCode] = useState("")
  const [isResending, setIsResending] = useState(false)

  const schema = useMemo(() => loginSchema(tValidation), [tValidation])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const currentEmail = form.getValues("email")

  const handleSuccess = () => {
    toast.success(tLogin("successLogin"))
    router.push("/")
    router.refresh()
  }

  const onSubmitCredentials = async (values: LoginFormValues) => {
    try {
      const check = await checkLoginStep(values)

      if (check.step === "invalid") {
        toast.error(tLogin("invalidCredentials"))
        return
      }

      if (check.step === "unverified") {
        setStep("unverified")
        return
      }

      if (check.step === "needs-2fa") {
        setStep("2fa")
        return
      }

      const result = await signIn("credentials", { ...values, redirect: false })
      if (result?.error) {
        toast.error(tLogin("loginError"))
        return
      }

      handleSuccess()
    } catch {
      toast.error(tLogin("genericError"))
    }
  }

  const onSubmitTwoFactor = async () => {
    const credentials = form.getValues()
    const result = await signIn("credentials", {
      ...credentials,
      totpCode,
      redirect: false,
    })

    if (result?.error) {
      toast.error(tLogin("invalidCode"))
      return
    }

    handleSuccess()
  }

  const handleResendEmail = async () => {
    if (!currentEmail) return
    setIsResending(true)
    try {
      await requestVerificationEmail(currentEmail)
      toast.success(tLogin("verificationEmailSent"))
    } catch {
      toast.error(tLogin("verificationEmailError"))
    } finally {
      setIsResending(false)
    }
  }

  if (step === "2fa") {
    return (
      <LoginTwoFactor
        code={totpCode}
        onCodeChange={setTotpCode}
        onSubmit={onSubmitTwoFactor}
        isSubmitting={form.formState.isSubmitting}
      />
    )
  }

  if (step === "unverified") {
    return (
      <LoginVerification
        email={currentEmail}
        isResending={isResending}
        onResend={handleResendEmail}
      />
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitCredentials)}
        className="space-y-4"
      >
        <LoginFields control={form.control} />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? tLogin("loggingIn") : t("login")}
        </Button>

        <OAuthButtons />
      </form>
    </Form>
  )
}
