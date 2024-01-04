import { getMxcUrl } from "@/lib/utils"

export function Avatar({
  url,
  name,
}: {
  url: string | undefined
  name: string
}) {
  return (
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary overflow-clip">
      {url ? (
        <img className="" src={getMxcUrl(url)} alt={name} />
      ) : (
        <span className="font-medium opacity-60">
          {(name && name[0]) || ""}
        </span>
      )}
    </div>
  )
}
