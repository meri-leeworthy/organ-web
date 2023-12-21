import { EditButton, DoneButton } from "@/components/styled/IconButton"
import { SectionType, sections } from "./SectionType"
import { useEffect, useState } from "react"
import { useRoom } from "@/lib/useRoom"
import { Spinner } from "@/components/ui"

export function EditableTitle({
  editSection,
  setEditSection,
  slug,
}: {
  editSection: SectionType
  setEditSection: (section: SectionType) => void
  slug: string
}) {
  const [name, setName] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const room = useRoom(slug)

  function updateTitle(name: string) {
    room?.setName(name)
  }

  useEffect(() => {
    if (!room || name) return
    room?.getName().then(value => {
      if (
        !value ||
        typeof value !== "object" ||
        !("name" in value) ||
        typeof value.name !== "string"
      )
        return

      if (name !== value.name) {
        setName(value.name)
      }
      setIsLoading(false)
    })
  }, [room, name])

  if (editSection === sections.title)
    return (
      <div className="flex gap-2 my-4">
        <input
          autoFocus
          className="self-start text-lg font-bold bg-transparent border border-[#1D170C33] px-2 rounded-md"
          value={name}
          id="title"
          aria-label="group-name"
          onChange={e => setName(e.target.value)}
        />
        <DoneButton
          onClick={() => {
            setEditSection(null)
            if (!name) throw new Error("name is empty")
            updateTitle(name)
          }}
        />
      </div>
    )
  else
    return (
      <h2 className="flex gap-2 items-center font-bold text-2xl my-4">
        {isLoading ? (
          <Spinner className="w-4 h-4 text-black animate-spin fill-pink-600" />
        ) : (
          <>
            {name ?? "No name yet."}
            <EditButton
              alt="Edit name"
              onClick={() => setEditSection("title")}
            />
          </>
        )}
      </h2>
    )
}
