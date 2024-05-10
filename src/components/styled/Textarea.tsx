import { cn } from "@/lib/utils"
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize"

export function Textarea(
  props: TextareaAutosizeProps & React.HTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <TextareaAutosize
      minRows={props.minRows || 2}
      className={cn(
        props.className,
        "w-full p-1 px-2 text-base placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
      )}
      {...props}
    />
  )
}
