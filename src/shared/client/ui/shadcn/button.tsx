import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/shared/client/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap " +
    "transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none " +
    "cursor-pointer focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 " +
          "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 " +
          "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",

        outline:
          "border border-input bg-background hover:bg-secondary " +
          "disabled:border-muted disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",

        ghost:
          "hover:bg-secondary " +
          "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 " +
          "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100",

        link:
          "text-primary underline-offset-4 hover:underline " +
          "disabled:text-muted-foreground disabled:no-underline disabled:opacity-100",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
