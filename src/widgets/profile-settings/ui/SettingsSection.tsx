type SettingsSectionProps = {
  title: string
  description?: string
  children: React.ReactNode
  destructive?: boolean
}

export function SettingsSection({
  title,
  description,
  children,
  destructive = false,
}: SettingsSectionProps) {
  return (
    <section
      className={
        destructive
          ? "overflow-hidden rounded-xl border border-destructive/20 bg-card"
          : "overflow-hidden rounded-xl border border-border/60 bg-card"
      }
    >
      <div className="border-b border-border/60 px-5 py-4 sm:px-7">
        <h2
          className={
            destructive
              ? "text-xl font-semibold text-destructive"
              : "text-xl font-semibold"
          }
        >
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="[&>*+*]:border-t [&>*+*]:border-border/60">
        {children}
      </div>
    </section>
  )
}
