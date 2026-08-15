import { cn } from "@/shared/lib/utils"

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-3", className)}>
      {children}
    </div>
  )
}
