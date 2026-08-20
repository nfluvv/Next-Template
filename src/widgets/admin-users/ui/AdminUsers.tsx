"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

import { UsersPagination } from "./UsersPagination"

import {
  adminUsersQueryKey,
  useAdminUsersQuery,
} from "../api/use-admin-users-query"

import { AdminUsersTable } from "./AdminUsersTable"
import { AdminUsersToolbar } from "./AdminUsersToolbar"

type AdminUsersProps = {
  initialQuery: string
  initialPage: number
  currentUserId?: string
}

export function AdminUsers({
  initialQuery,
  initialPage,
  currentUserId,
}: AdminUsersProps) {
  const t = useTranslations("adminUsers")
  const queryClient = useQueryClient()

  const [query, setQuery] = useState(initialQuery)
  const [page, setPage] = useState(initialPage)

  const { data, isPending, isError } = useAdminUsersQuery(query, page)

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handleRoleChangeSuccess = () => {
    void queryClient.invalidateQueries({
      queryKey: adminUsersQueryKey(query, page),
    })
  }

  if (isError) {
    return <p className="text-sm text-destructive">{t("loadError")}</p>
  }

  return (
    <div className="space-y-4">
      <AdminUsersToolbar
        query={query}
        total={data?.total}
        onSearch={handleSearch}
      />

      <AdminUsersTable
        users={data?.users ?? []}
        isPending={isPending}
        currentUserId={currentUserId}
        onRoleChangeSuccess={handleRoleChangeSuccess}
      />

      {data && (
        <UsersPagination
          page={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
