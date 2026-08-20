"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/shared/client/ui"

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
  const t = useTranslations("adminUsers")
  const tCommon = useTranslations("common")

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {t("pagination", { page, totalPages })}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {tCommon("back")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t("next")}
        </Button>
      </div>
    </div>
  )
}
