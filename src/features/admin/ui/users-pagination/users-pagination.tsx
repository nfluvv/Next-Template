"use client"

import { Button } from "@/shared/ui"

type UsersPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const UsersPagination = ({
  page,
  totalPages,
  onPageChange,
}: UsersPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Страница {page} из {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Вперёд
        </Button>
      </div>
    </div>
  )
}
