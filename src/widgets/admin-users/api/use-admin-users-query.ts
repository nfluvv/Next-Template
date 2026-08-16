import { keepPreviousData, useQuery } from "@tanstack/react-query"

export type AdminUsersResponse = {
  users: Array<{
    id: string
    name: string | null
    username: string | null
    email: string
    image: string | null
    role: "USER" | "ADMIN"
    createdAt: string
  }>
  total: number
  totalPages: number
  page: number
}

export const adminUsersQueryKey = (query: string, page: number) =>
  ["admin-users", query, page] as const

export function useAdminUsersQuery(query: string, page: number) {
  return useQuery({
    queryKey: adminUsersQueryKey(query, page),

    queryFn: async (): Promise<AdminUsersResponse> => {
      const params = new URLSearchParams({
        q: query,
        page: String(page),
      })

      const res = await fetch(`/api/admin/users?${params}`)

      if (!res.ok) {
        throw new Error("Не удалось загрузить пользователей")
      }

      return res.json()
    },

    placeholderData: keepPreviousData,
  })
}
