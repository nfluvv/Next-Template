import { SearchUsersInput } from "@/features/admin"

type AdminUsersToolbarProps = {
  query: string
  total?: number
  onSearch: (value: string) => void
}

export function AdminUsersToolbar({
  query,
  total,
  onSearch,
}: AdminUsersToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <SearchUsersInput value={query} onChange={onSearch} />

      {total !== undefined && (
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          Всего: {total}
        </span>
      )}
    </div>
  )
}
