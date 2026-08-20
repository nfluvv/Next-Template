"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { useTranslations } from "next-intl"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/client/ui"
import { USER_ROLES, type UserRole } from "@/entities/user"

import { updateUserRole } from "../api/update-user-role"

type RoleSelectProps = {
  userId: string
  userLabel: string
  currentRole: UserRole
  disabled?: boolean
  onSuccess?: () => void
}

export const RoleSelect = ({
  userId,
  userLabel,
  currentRole,
  disabled,
  onSuccess,
}: RoleSelectProps) => {
  const t = useTranslations("roleSelect")
  const tCommon = useTranslations("common")
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)

  const mutation = useMutation({
    mutationFn: (role: UserRole) => updateUserRole(userId, role),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success(t("success"))
      onSuccess?.()
    },
  })

  const handleChange = (value: string) => {
    const role = value as UserRole

    if (role === "ADMIN") {
      setPendingRole(role)
      return
    }

    mutation.mutate(role)
  }

  return (
    <>
      <Select
        value={currentRole}
        onValueChange={handleChange}
        disabled={disabled || mutation.isPending}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {USER_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog
        open={pendingRole !== null}
        onOpenChange={(open) => !open && setPendingRole(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDescription", { userLabel })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingRole(null)}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRole) mutation.mutate(pendingRole)
                setPendingRole(null)
              }}
            >
              {t("grantAccess")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
