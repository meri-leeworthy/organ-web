export function Textarea(
  props: React.HTMLAttributes<HTMLTextAreaElement> & {
    placeholder?: string
    value?: string
    rows?: number
    onChange?: (value: string) => void
  }
) {
  return (
    <textarea
      className="w-full p-1 text-base placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-[#ddd2ff] focus:outline-dashed focus:outline-1 focus:outline-[#ddd2ff]"
      {...props}></textarea>
  )
}
