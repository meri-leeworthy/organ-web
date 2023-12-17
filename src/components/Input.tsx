export function Input(
  props: React.HTMLAttributes<HTMLInputElement> & {
    type: string
    placeholder?: string
    value?: string
  }
) {
  return (
    <input
      className="grow font-medium px-1 placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-[#ddd2ff] focus:outline-dashed focus:outline-1 focus:outline-[#ddd2ff]"
      {...props}
    />
  )
}

// <input
//   {...props}
//   value={value}
//   onChange={e => onChange(e.currentTarget.value)}
// />
