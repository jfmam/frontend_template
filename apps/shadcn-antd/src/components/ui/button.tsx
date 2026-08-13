import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 border text-sm font-normal whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity] duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-button-disabled disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:shadow-none aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:border-button-disabled aria-disabled:bg-button-disabled aria-disabled:text-button-disabled-foreground aria-disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground shadow-button-primary hover:border-primary-hover hover:bg-primary-hover active:border-primary-active active:bg-primary-active",
        default:
          "border-button-border bg-background text-foreground shadow-button hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active",
        dashed:
          "border-dashed border-button-border bg-background text-foreground shadow-button hover:border-primary-hover hover:text-primary-hover active:border-primary-active active:text-primary-active",
        text: "border-transparent bg-transparent text-foreground hover:bg-button-subtle-hover active:bg-button-subtle-active",
        link: "border-transparent bg-transparent px-0 text-primary hover:text-primary-hover active:text-primary-active",
        danger:
          "border-destructive bg-destructive text-destructive-foreground shadow-button-danger hover:border-destructive-hover hover:bg-destructive-hover active:border-destructive-active active:bg-destructive-active",
        "danger-outline":
          "border-destructive bg-background text-destructive shadow-button hover:border-destructive-hover hover:text-destructive-hover active:border-destructive-active active:text-destructive-active",
        ghost:
          "border-white/85 bg-transparent text-white shadow-none hover:border-white hover:bg-white/10 active:bg-white/20 disabled:border-white/25 disabled:bg-transparent disabled:text-white/30 aria-disabled:border-white/25 aria-disabled:bg-transparent aria-disabled:text-white/30",
      },
      size: {
        small:
          "h-6 rounded-sm px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        medium: "h-8 rounded-md px-4 text-sm",
        large: "h-10 rounded-lg px-4 text-base",
        icon: "size-8 rounded-md p-0",
        "icon-small":
          "size-6 rounded-sm p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-large":
          "size-10 rounded-lg p-0 [&_svg:not([class*='size-'])]:size-4.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

function Button({
  className,
  variant = "default",
  size = "medium",
  asChild = false,
  loading = false,
  disabled,
  type,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }) {
  const isDisabled = disabled || loading
  const classNames = cn(buttonVariants({ variant, size, className }))

  if (
    import.meta.env.DEV &&
    size?.startsWith("icon") &&
    !props["aria-label"] &&
    !props["aria-labelledby"]
  ) {
    throw new Error("Icon-only buttons require an accessible name")
  }

  if (asChild) {
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      onClick?.(event)
    }

    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={classNames}
        {...props}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : props.tabIndex}
        onClick={handleClick}
      >
        {loading ? (
          <span
            data-slot="button-spinner"
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
          />
        ) : null}
        <Slot.Slottable>{children}</Slot.Slottable>
      </Slot.Root>
    )
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      className={classNames}
      {...props}
      type={type ?? "button"}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
    >
      {loading ? (
        <span
          data-slot="button-spinner"
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
        />
      ) : null}
      {children}
    </button>
  )
}

export { Button, buttonVariants, type ButtonSize, type ButtonVariant }
