type ProfileIdentityProps = {
  name: string | null
  username: string | null
}

export function ProfileIdentity({
  name,
  username,
}: ProfileIdentityProps) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {name ?? "Без имени"}
        </h1>

        <span
          aria-hidden
          className="text-sm text-muted-foreground/40"
        >
          ✦
        </span>
      </div>

      <p className="mt-0.5 text-sm text-muted-foreground">
        @{username ?? "unknown"}
      </p>
    </div>
  )
}