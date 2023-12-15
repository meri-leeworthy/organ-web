export function Button({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes =
    `rounded-[100%] px-2 py-1 ${className} ` +
    (className === undefined && "border border-black")
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
