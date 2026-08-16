import Link from "next/link"

import { RoleSelect } from "@/features/admin"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  TableCell,
  TableRow,
} from "@/shared/ui"

import type { AdminUsersResponse } from "../api/use-admin-users-query"

type AdminUsersTableRowProps = {
  user: AdminUsersResponse["users"][number]
  currentUserId?: string
  onRoleChangeSuccess: () => void
}

export function AdminUsersTableRow({
  user,
  currentUserId,
  onRoleChangeSuccess,
}: AdminUsersTableRowProps) {
  const initial = (user.name ?? user.email).charAt(0).toUpperCase()

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />

            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>

          {user.username ? (
            <Link
              href={`/users/${user.username}`}
              className="font-medium hover:underline"
            >
              {user.name ?? "—"}
            </Link>
          ) : (
            <span className="font-medium">{user.name ?? "—"}</span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">{user.email}</TableCell>

      <TableCell>
        <RoleSelect
          userId={user.id}
          userLabel={user.name ?? user.email}
          currentRole={user.role}
          disabled={user.id === currentUserId}
          onSuccess={onRoleChangeSuccess}
        />
      </TableCell>
    </TableRow>
  )
}
