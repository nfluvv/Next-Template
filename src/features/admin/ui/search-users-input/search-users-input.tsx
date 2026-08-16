"use client"

import { useEffect, useState } from "react"

import { Input } from "@/shared/ui"

type SearchUsersInputProps = {
  value: string
  onChange: (value: string) => void
}

export const SearchUsersInput = ({
  value,
  onChange,
}: SearchUsersInputProps) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => onChange(localValue), 350)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue])

  return (
    <Input
      placeholder="Поиск по имени или email..."
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  )
}
