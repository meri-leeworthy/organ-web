import { IconX } from "@tabler/icons-react"

export const Cancel = ({ onClick, ...props }: { onClick: () => any }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="self-start mb-3 text-base sm:self-start"
      {...props}>
      <IconX />
    </button>
  )
}
