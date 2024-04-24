export function AvatarFull({ url }: { url: string | undefined }) {
  return (
    <div className="relative min-w-20">
      <div
        className={`absolute h-full w-full ${
          url ? "bg-transparent" : "bg-[#1D170C33]"
        }`}
      />
      {url && (
        <img src={url} alt="avatar" className="w-20 opacity-100 lg:w-40" />
      )}
    </div>
  )
}
