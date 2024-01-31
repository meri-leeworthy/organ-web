import { twMerge } from "tailwind-merge"

export function Button({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = twMerge(
    "rounded-[100%] px-2 py-1",
    "border border-black hover:border-dashed",
    className
  )
  // `rounded-[100%] px-2 py-1 ${className} ` +
  // (className === undefined && "border border-black hover:border-dashed")
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
