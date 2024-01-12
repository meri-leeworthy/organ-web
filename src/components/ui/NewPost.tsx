/* eslint-disable @next/next/no-img-element */
"use client"

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useClient } from "@/hooks/useClient"
import {
  OrganCalEventUnstable,
  OrganPostUnstable,
  organCalEventUnstable,
  organPostUnstable,
} from "@/lib/types"
import { Room } from "simple-matrix-sdk"
import {
  IconCalendarEvent,
  IconCamera,
  IconNorthStar,
} from "@tabler/icons-react"
// import { SelectAuthor } from "@/components/SelectAuthor"
// import Link from "next/link"
import { Spinner } from "./Spinner"
import { getMxcUrl, toValidDateString } from "@/lib/utils"
import { Input, Textarea, Button } from "../styled"

type PostType = "post" | "event"

export function Description(props: {
  type: PostType
  content: string
  setContent: Dispatch<SetStateAction<string>>
  rows?: number
}) {
  return (
    <div className="flex grow">
      <Textarea
        autoFocus
        id="content"
        aria-label="content"
        placeholder={
          props.type === "post" ? "Write your update here" : "Event description"
        }
        rows={props.rows || 3}
        value={props.content}
        onChange={e =>
          props.setContent(
            typeof e === "object" && e !== null && "target" in e
              ? (e.target as HTMLTextAreaElement).value
              : ""
          )
        }
        className="w-full p-1 text-base placeholder:text-[#8258ff] placeholder:opacity-40 bg-transparent border border-primary focus:outline-dashed focus:outline-1 focus:outline-primary"
      />
    </div>
  )
}

export const NewPost = ({ slug }: { slug: string }) => {
  const [type, setType] = useState<PostType>("post")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [startDate, setStartDate] = useState(toValidDateString(new Date()))
  const [startTime, setStartTime] = useState("00:00")
  const [endDate, setEndDate] = useState(toValidDateString(new Date()))
  const [endTime, setEndTime] = useState("00:00")
  const [place, setPlace] = useState("")
  const [imageSrcs, setImageSrcs] = useState<string[]>([])
  const [author, setAuthor] = useState<[Room, string]>()
  const [allDay, setAllDay] = useState(false)

  console.log("imageSrcs", imageSrcs)

  const client = useClient()
  const room = useMemo(() => {
    if (!client) return
    return new Room(`!${slug}:radical.directory`, client)
  }, [client, slug])

  useEffect(() => {
    if (!room) return
    room.getName().then(value => {
      const name =
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        typeof value.name === "string"
          ? value.name
          : ""
      setAuthor([room, name])
    })
  }, [client, room])

  if (!client) return "loading..."

  console.log("datetime", startTime, startDate)

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
    const roomId = authorRoom.roomId
    const authorKV = { name: authorName, id: roomId }

    switch (type) {
      case "post":
        const messageEvent: OrganPostUnstable = {
          msgtype: organPostUnstable,
          title,
          body: content,
          author: authorKV,
          tags: [],
          media: imageSrcs,
        }
        const result = await room?.sendMessage(messageEvent)
        console.log("result", result)
        break
      case "event":
        const eventEvent: OrganCalEventUnstable = {
          msgtype: organCalEventUnstable,
          title,
          body: content,
          host: authorKV,
          tags: [],
          start: `${startDate}T${startTime}`,
          end: `${endDate}T${endTime}`,
          allDay,
          avatar: imageSrcs[0],
          location: place,
        }
        const result2 = await room?.sendMessage(eventEvent)
        console.log("result2", result2)
        break
    }
    location.reload()
    // redirect(`/orgs/${params.slug}`)
  }

  return (
    <div className="rounded bg-[#fff3] flex flex-col gap-2">
      {imageSrcs[0] && (
        <div className="flex items-center justify-center grow">
          <img
            src={imageSrcs[0]}
            alt="post"
            key={imageSrcs[0]}
            className="h-72"
          />
        </div>
      )}
      <form onSubmit={handlePostSubmit} className="flex flex-col gap-2 grow">
        <div className="flex gap-1">
          <PostTypeButton type={type} thisType="post" setType={setType}>
            <IconNorthStar size={16} /> Post
          </PostTypeButton>
          <PostTypeButton type={type} thisType="event" setType={setType}>
            <IconCalendarEvent size={16} /> Event
          </PostTypeButton>
          {type === "event" && (
            <Input
              type="text"
              id="title"
              placeholder="Title"
              aria-label="title"
              value={title}
              onChange={e => setTitle((e.target as HTMLInputElement).value)}
            />
          )}
        </div>
        <Description type={type} content={content} setContent={setContent} />

        <div className="flex flex-col gap-2">
          {type === "event" && (
            <Input
              type="text"
              id="location"
              placeholder="Location"
              aria-label="location"
              value={place}
              onChange={e => setPlace((e.target as HTMLInputElement).value)}
            />
          )}

          <div className="flex items-center gap-2 ">
            {type === "event" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={e =>
                    setStartDate(toValidDateString(new Date(e.target.value)))
                  }
                  className="font-medium px-1 text-[#8258ff] bg-transparent text-opacity-50 border border-primary focus:outline-dashed focus:outline-1 focus:outline-primary"
                />
                {!allDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => {
                      console.log("e", e)
                      setStartTime(e.currentTarget.value)
                    }}
                    step="300"
                    className="font-medium px-1 text-[#8258ff] bg-transparent text-opacity-50 border border-primary focus:outline-dashed focus:outline-1 focus:outline-primary"
                  />
                )}

                <label className="flex items-center gap-2 text-xs uppercase opacity-80">
                  All Day?
                  <input
                    type="checkbox"
                    id="allday"
                    name="allday"
                    checked={allDay}
                    onChange={e => setAllDay(e.target.checked)}
                    className="mr-1 outline-4 outline-primary checked:bg-primary"
                  />
                </label>
              </>
            )}

            <div className="flex items-center justify-end gap-2 ml-auto">
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
          </div>
        </div>
      </form>
    </div>
  )
}

export function UploadImageButton({
  imageSrcs,
  setImageSrcs,
}: {
  imageSrcs: string | string[]
  setImageSrcs:
    | Dispatch<SetStateAction<string[]>>
    | Dispatch<SetStateAction<string>>
}) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const client = useClient()
  // console.log("file", file)

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
          if (typeof imageSrcs === "string") {
            const newImageSrc = getMxcUrl(result.content_uri)
            console.log("newImageSrc", newImageSrc)
            ;(setImageSrcs as Dispatch<SetStateAction<string>>)(newImageSrc)
          } else {
            const newImageSrcs = [...imageSrcs, getMxcUrl(result.content_uri)]
            console.log("newImageSrcs", newImageSrcs)
            ;(setImageSrcs as Dispatch<SetStateAction<string[]>>)(newImageSrcs)
          }
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
        className="flex items-center border-dashed justify-center px-2 py-1 rounded-[100%] text-[#9572ff] border border-primary cursor-pointer">
        {loading ? (
          <Spinner className="w-4 h-4 text-primary animate-spin fill-[#9572ff]" />
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

export function PostTypeButton({
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
      className="border border-primary text-sm gap-1 flex items-center disabled:bg-primary disabled:border-transparent text-[#9572ff] bg-white disabled:text-black">
      {children}
    </Button>
  )
}
