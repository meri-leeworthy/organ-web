export function Avatar({
  url,
  name,
}: {
  url: string | undefined
  name: string
}) {
  return (
    <div className="flex items-center justify-center bg-primary rounded-full overflow-clip w-6 h-6">
      {url ? (
        <img className="" src={url} alt={name} />
      ) : (
        <span className="font-medium opacity-60">
          {(name && name[0]) || ""}
        </span>
      )}
    </div>
  )
}
