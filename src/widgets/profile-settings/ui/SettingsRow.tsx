type SettingsRowProps = {
  title: string
  description: string
  children: React.ReactNode
  destructive?: boolean
}

export function SettingsRow({
  title,
  description,
  children,
  destructive = false,
}: SettingsRowProps) {
  return (
    <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
      <div className="max-w-xs">
        <h3
          className={
            destructive
              ? "text-sm font-semibold text-destructive"
              : "text-sm font-semibold"
          }
        >
          {title}
        </h3>

        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="w-full sm:w-70">{children}</div>
    </div>
  )
}
