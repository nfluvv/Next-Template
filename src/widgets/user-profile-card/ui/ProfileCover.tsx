export function ProfileCover() {
  return (
    <div className="relative h-28 border-b border-border/60 bg-muted/30 sm:h-36">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--foreground)/0.16)_1px,transparent_1px),linear-gradient(hsl(var(--foreground)/0.15)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-40" />

      <div className="absolute right-5 top-5 select-none font-mono text-[9px] font-bold tracking-[0.3em] text-muted-foreground/40">
        01 / PROFILE
      </div>
    </div>
  )
}