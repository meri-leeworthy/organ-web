/* eslint-disable @next/next/no-img-element */
"use client"

import { useClient } from "@/lib/useClient"
import { IconEdit, IconPhoto } from "@tabler/icons-react"
import { useRoom } from "@/lib/useRoom"
import { getMessagesChunk, getMxcUrl } from "@/lib/utils"
import { useEffect, useState } from "react"

export function UploadOrShowAvatar({
  slug,
}: // imageUri,
{
  slug: string
  // imageUri: string | null
}) {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const room = useRoom(slug)
  useEffect(() => {
    if (!room) return
    const messagesIterator = room.getMessagesAsyncGenerator()
    getMessagesChunk(messagesIterator).then(messagesChunk => {
      const avatar = messagesChunk.find(
        (message: Event) => message.type === "m.room.avatar"
      )
      console.log("avatar", avatar)
      setImageUri(avatar?.content?.url)
      setIsLoading(false)
    })
  }, [room])

  console.log("imageUri", imageUri)
  if (imageUri) {
    const avatarUrl = getMxcUrl(imageUri)
    return (
      <div className="flex items-end relative">
        <img src={avatarUrl} alt="avatar" width="120" />
        <UploadAvatar {...{ slug }} edit />
      </div>
    )
  }

  return <UploadAvatar {...{ slug }} />
}

function UploadAvatar({ slug, edit }: { slug: string; edit?: boolean }) {
  const client = useClient()
  const room = useRoom(slug)
  if (!client || !room) return <div>loading...</div>

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const result = file && (await client?.uploadFile(file))
      await room.sendEvent("m.room.avatar", { url: result.content_uri })
      console.log("result", result)
      location.reload()
    }
  }

  return (
    <form className={`flex mt-2 ${edit ? "absolute top-2 left-2" : "w-72 "}`}>
      <label
        htmlFor="file"
        className="flex gap-1 text-xs items-center border border-transparent bg-[#ffffff99] hover:border-grey rounded uppercase px-1 self-start cursor-pointer">
        {edit ? <IconEdit size={12} /> : <IconPhoto size={12} />}
        {!edit && "Add Profile Image"}
      </label>
      <input
        type="file"
        id="file"
        onChange={handleFileChange}
        aria-label="Upload Avatar"
        className="opacity-0 w-0 h-0 file:opacity-0"
      />
    </form>
  )
}
