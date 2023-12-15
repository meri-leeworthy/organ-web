export function Button({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`rounded-[100%] px-2 py-1 ${className}`} {...props}>
      {children}
    </button>
  )
}
