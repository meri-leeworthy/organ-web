/* eslint-disable @next/next/no-img-element */
"use client"

import { useClient } from "@/lib/useClient"
import { IconEdit, IconPhoto } from "@tabler/icons-react"
import { useRoom } from "@/lib/useRoom"
import { getMxcUrl } from "@/lib/utils"
import { useEffect, useState } from "react"

export function UploadOrShowAvatar({
  slug,
  handler,
}: // imageUri,
{
  slug: string
  handler?: (e: React.ChangeEvent<HTMLInputElement>) => void
  // imageUri: string | null
}) {
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const room = useRoom(slug)
  useEffect(() => {
    if (!room) return
    room.getAvatarUrl().then((url): void => {
      console.log("url", url)
      setImageUri(url)
      setIsLoading(false)
    })
  }, [room])

  console.log("imageUri", imageUri)
  if (imageUri) {
    const avatarUrl = getMxcUrl(imageUri)
    return (
      <div className="relative flex items-end">
        <img src={avatarUrl} alt="avatar" width="120" />
        <UploadAvatar {...{ slug }} handler={handler} edit />
      </div>
    )
  }

  return <UploadAvatar {...{ slug }} />
}

function UploadAvatar({
  slug,
  edit,
  handler,
}: {
  slug: string
  edit?: boolean
  handler?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const client = useClient()
  const room = useRoom(slug)
  if (!client || !room) return <div>loading...</div>

  const defaultHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const result = file && (await client?.uploadFile(file))
      await room.sendStateEvent("m.room.avatar", { url: result.content_uri })
      console.log("result", result)
      location.reload()
    }
  }

  const handleFileChange = handler || defaultHandler
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
        className="w-0 h-0 opacity-0 file:opacity-0"
      />
    </form>
  )
}
