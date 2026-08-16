"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

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
} from "@/shared/ui"
import { USER_ROLES, type UserRole } from "@/entities/user"

import { updateUserRole } from "../../api/update-user-role"

type RoleSelectProps = {
  userId: string
  userLabel: string
  currentRole: UserRole
  disabled?: boolean
  onSuccess?: () => void // 👈 Передаем колбэк для инвалидации кэша сверху
}

export const RoleSelect = ({
  userId,
  userLabel,
  currentRole,
  disabled,
  onSuccess,
}: RoleSelectProps) => {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)

  const mutation = useMutation({
    mutationFn: (role: UserRole) => updateUserRole(userId, role),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success("Роль обновлена")
      onSuccess?.() // 👈 Вызываем колбэк, когда сервер ответил успехом
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
            <AlertDialogTitle>Выдать права администратора?</AlertDialogTitle>
            <AlertDialogDescription>
              Пользователь «{userLabel}» получит полный доступ к админ-панели,
              включая управление ролями других пользователей.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingRole(null)}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRole) mutation.mutate(pendingRole)
                setPendingRole(null)
              }}
            >
              Выдать права
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
