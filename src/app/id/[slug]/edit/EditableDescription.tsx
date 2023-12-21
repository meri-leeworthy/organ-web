import { EditButton, DoneButton } from "@/components/styled/IconButton"
import { SectionType, sections } from "./SectionType"
import { useEffect, useMemo, useState } from "react"
import { Spinner } from "@/components/ui"
import { useRoom } from "@/lib/useRoom"
import { getMessagesChunk } from "@/lib/utils"
import { Room } from "simple-matrix-sdk"

//TODO: add a loading state for when we're fetching data, and don't say 'loading' if we just didn't find any

export function EditableDescription({
  editSection,
  setEditSection,
  // description,
  // setDescription,
  // updateDescription,
  slug,
}: {
  editSection: SectionType
  setEditSection: (section: SectionType) => void
  // description?: string
  // setDescription: (name: string) => void
  // updateDescription: (name: string) => Promise<void>
  slug: string
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [description, setDescription] = useState<string>("")
  const room = useRoom(slug)

  async function updateDescription(description: string) {
    const result = await room?.setTopic(description)
    console.log("result updating desc", result)
  }

  useEffect(() => {
    if (!room || description) return
    const messagesIterator = room.getMessagesAsyncGenerator()
    // setIsLoading(true)
    getMessagesChunk(messagesIterator).then(messagesChunk => {
      console.log("messagesChunk", messagesChunk)
      setDescription(
        messagesChunk.find((message: Event) => message.type === "m.room.topic")
          ?.content?.topic
      )
      setIsLoading(false)
    })
  }, [room, isLoading, description])

  return (
    <div className="flex gap-2 py-4">
      {editSection === sections.description ? (
        <>
          <textarea
            autoFocus
            className="self-start w-full text-base h-80 bg-transparent border border-[#1D170C33] px-2 rounded-md"
            value={description}
            id="description"
            aria-label="group-description"
            onChange={e => setDescription(e.target.value)}
          />

          <DoneButton
            onClick={async () => {
              setIsLoading(true)
              setEditSection(null)
              await updateDescription(description || "")
              setIsLoading(false)
            }}
          />
        </>
      ) : (
        <>
          <p className="whitespace-pre-line">
            {description?.trim() === "" ? "No description yet." : description}
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner className="w-4 h-4 text-black animate-spin fill-pink-600" />
            </div>
          ) : (
            <EditButton
              alt="Edit description"
              onClick={() => setEditSection("description")}
            />
          )}
        </>
      )}
    </div>
  )
}
