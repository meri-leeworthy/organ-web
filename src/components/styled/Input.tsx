export function Input(
  props: React.HTMLAttributes<HTMLInputElement> & {
    type: string
    disabled?: boolean
    name?: string
    placeholder?: string
    value?: string
  }
) {
  return (
    <input
      className="grow font-medium px-1 placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-primary focus:outline-dashed focus:outline-1 focus:outline-primary disabled:opacity-50"
      disabled={props.disabled || false}
      {...props}
    />
  )
}

// <input
//   {...props}
//   value={value}
//   onChange={e => onChange(e.currentTarget.value)}
// />
