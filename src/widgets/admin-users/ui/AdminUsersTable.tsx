import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui"

import type { AdminUsersResponse } from "../api/use-admin-users-query"

import { AdminUsersTableRow } from "./AdminUsersTableRow"

type AdminUsersTableProps = {
  users: AdminUsersResponse["users"]
  isPending: boolean
  currentUserId?: string
  onRoleChangeSuccess: () => void
}

export function AdminUsersTable({
  users,
  isPending,
  currentUserId,
  onRoleChangeSuccess,
}: AdminUsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Пользователь</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Роль</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="h-24 text-center text-sm text-muted-foreground"
            >
              {isPending ? "Загрузка..." : "Пользователи не найдены"}
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <AdminUsersTableRow
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              onRoleChangeSuccess={onRoleChangeSuccess}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
