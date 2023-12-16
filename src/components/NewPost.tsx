/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { useClient } from "@/lib/useClient"
import {
  DirectoryRadicalPostUnstable,
  directoryRadicalPostUnstable,
} from "@/lib/types"
import { Room } from "simple-matrix-sdk"
import {
  IconCalendarEvent,
  IconCamera,
  IconNorthStar,
} from "@tabler/icons-react"
// import { SelectAuthor } from "@/components/SelectAuthor"
// import Link from "next/link"
import { Button } from "./Button"
import { Spinner } from "./Spinner"
import { getMxcUrl } from "@/lib/utils"

type PostType = "post" | "event"

function toXX(s: number) {
  return s < 10 ? `0${s}` : s
}

function toValidDateTimeString(date: Date) {
  return `${date.getFullYear()}-${toXX(date.getMonth() + 1)}-${toXX(
    date.getDate()
  )}T${toXX(date.getHours())}:${toXX(date.getMinutes())}` + date.getSeconds()
    ? `:${toXX(date.getSeconds())}`
    : ""
}

export const NewPost = ({ slug }: { slug: string }) => {
  const [type, setType] = useState<PostType>("post")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [datetime, setDatetime] = useState("")
  const [place, setPlace] = useState("")
  const [imageSrcs, setImageSrcs] = useState<string[]>([])
  const [author, setAuthor] = useState<[Room, string]>()

  const client = useClient()
  if (!client) return "loading..."
  const room = new Room(`!${slug}:radical.directory`, client)

  async function handlePostSubmit(event: React.FormEvent<HTMLFormElement>) {
    // const authorRoom = new Room(content?.author, client)
    // const roomName = await authorRoom.getName()
    // console.log("roomName", roomName)
    // const roomNameString =
    //   roomName &&
    //   typeof roomName === "object" &&
    //   roomName !== null &&
    //   "name" in roomName &&
    //   typeof roomName.name === "string"
    //     ? roomName.name
    //     : ""

    event.preventDefault()
    if (!author) return
    const [authorRoom, authorName] = author
    const roomId = authorRoom.useID()
    const authorKV = { name: authorName, id: roomId }
    const messageEvent: DirectoryRadicalPostUnstable = {
      msgtype: directoryRadicalPostUnstable,
      title,
      body: content,
      author: authorKV,
      tags: [],
      media: imageSrcs,
    }
    const result = await room.sendMessage(messageEvent)
    console.log("result", result)
    location.reload()
    // redirect(`/orgs/${params.slug}`)
  }

  return (
    <div className="rounded bg-[#fff3] flex flex-col gap-2">
      {imageSrcs[0] && (
        <div className="flex items-center grow justify-center">
          <img
            src={imageSrcs[0]}
            alt="post"
            key={imageSrcs[0]}
            className="h-72"
          />
        </div>
      )}
      <form onSubmit={handlePostSubmit} className="flex flex-col grow gap-2">
        <div className="flex gap-1">
          <PostTypeButton type={type} thisType="post" setType={setType}>
            <IconNorthStar size={16} /> Post
          </PostTypeButton>
          <PostTypeButton type={type} thisType="event" setType={setType}>
            <IconCalendarEvent size={16} /> Event
          </PostTypeButton>
          {type === "event" && (
            <input
              type="text"
              id="title"
              placeholder="Title"
              aria-label="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full ml-1 font-medium px-1 placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-[#ddd2ff] focus:outline-dashed focus:outline-1 focus:outline-[#ddd2ff]"
            />
          )}
        </div>
        <div className="flex grow">
          <textarea
            id="content"
            aria-label="content"
            placeholder={
              type === "post" ? "Write your update here" : "Event description"
            }
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-1 text-base placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-[#ddd2ff] focus:outline-dashed focus:outline-1 focus:outline-[#ddd2ff]"></textarea>
        </div>
        {type === "event" && (
          <div className="flex gap-2">
            <input
              type="datetime-local"
              defaultValue={datetime}
              onChange={e =>
                setDatetime(toValidDateTimeString(new Date(e.target.value)))
              }
              className="font-medium px-1 text-[#8258ff] bg-transparent text-opacity-50 border border-[#ddd2ff] focus:outline-dashed focus:outline-1 focus:outline-[#ddd2ff]"
            />
            <input
              type="text"
              id="location"
              placeholder="Location"
              aria-label="location"
              value={place}
              onChange={e => setPlace(e.target.value)}
              className="grow font-medium px-1 placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-[#ddd2ff] focus:outline-dashed focus:outline-1 focus:outline-[#ddd2ff]"
            />
          </div>
        )}
        <div className="flex justify-end gap-2 items-center">
          <UploadImageButton
            imageSrcs={imageSrcs}
            setImageSrcs={setImageSrcs}
          />

          <Button
            type="submit"
            className="rounded-[100%] border border-black border-opacity-40 text-sm px-2 py-1 gap-1 self-end flex items-center">
            Share
          </Button>
        </div>
        {/* <Link
              href={`/id/${slug}/post/new`}
              className="text-xs text-[#a284ff] border border-[#ddd2ff] border-dashed px-1">
              more options
            </Link> */}
      </form>
    </div>
  )
}

function UploadImageButton({
  imageSrcs,
  setImageSrcs,
}: {
  imageSrcs: string[]
  setImageSrcs: (imageSrcs: string[]) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const client = useClient()
  console.log("file", file)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setLoading(true)
    }
  }

  useEffect(() => {
    try {
      file &&
        client?.uploadFile(file).then(result => {
          console.log("result", result)
          setImageSrcs([...imageSrcs, getMxcUrl(result.content_uri)])
          setFile(null)
          setLoading(false)
        })
      // if (!result) return
    } catch (error) {
      console.error("error", error)
    }
  }, [file, imageSrcs, setImageSrcs, client])

  return (
    <div className="">
      <label
        htmlFor="image"
        className="flex items-center border-dashed justify-center px-2 py-1 rounded-[100%] text-[#9572ff] border border-[#ddd2ff] cursor-pointer">
        {loading ? (
          <Spinner className="w-4 h-4 text-[#ddd2ff] animate-spin fill-[#9572ff]" />
        ) : (
          <IconCamera size={16} />
        )}
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        id="image"
        className="hidden"
      />
    </div>
  )
}

function PostTypeButton({
  type,
  thisType,
  setType,
  children,
}: {
  type: PostType
  thisType: PostType
  setType: (type: PostType) => void
  children: React.ReactNode
}) {
  return (
    <Button
      onClick={() => setType(thisType)}
      disabled={thisType === type}
      className="border border-[#ddd2ff] text-sm gap-1 flex items-center disabled:bg-[#ddd2ff] disabled:border-transparent text-[#9572ff] bg-white disabled:text-black">
      {children}
    </Button>
  )
}
