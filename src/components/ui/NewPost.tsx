/* eslint-disable @next/next/no-img-element */
"use client"

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { useClient } from "@/hooks/useClient"
import {
  // OrganCalEventUnstable,
  // OrganPostUnstable,
  // organCalEventUnstable,
  organPostType,
  // organPostTypeValue,
  organRoomType,
  organRoomTypeTree,
  organRoomTypeValue,
} from "@/types/schema"

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
import { organPostMeta } from "@/types/post"

type PostType = "post" | "event"

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

  // console.log("imageSrcs", imageSrcs)

  const client = useClient()
  const room = useMemo(() => {
    if (!client) return
    return new Room(`!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`, client)
  }, [client, slug])

  useEffect(() => {
    if (!room) return
    room.getName().then((value: any) => {
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

  // console.log("datetime", startTime, startDate)

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
    // const authorKV = { name: authorName, id: roomId }

    // const postEvent: OrganPostUnstable | OrganCalEventUnstable =
    //   type === "post"
    //     ? {
    //         msgtype: organPostUnstable,
    //         title,
    //         body: content,
    //         author: authorKV,
    //         tags: [],
    //         media: imageSrcs
    //       }
    //     : {
    //         msgtype: organCalEventUnstable,
    //         title,
    //         body: content,
    //         host: authorKV,
    //         tags: [],
    //         start: `${startDate}T${startTime}`,
    //         end: `${endDate}T${endTime}`,
    //         allDay,
    //         avatar: imageSrcs[0],
    //         location: place
    //       }

    const newPostRoomResult = client?.createRoom({
      name: title,
      topic: content,
      creation_content: {
        type: "m.space",
      },
      initial_state: [
        {
          type: "m.room.power_levels",
          state_key: "",
          content: {
            ban: 50,
            events: {
              "m.room.name": 100,
              "m.room.power_levels": 100,
            },
            events_default: 0,
            invite: 50,
            kick: 50,
            notifications: {
              room: 20,
            },
            redact: 50,
            state_default: 50,
            users: {
              ["@_relay_bot:" + process.env.NEXT_PUBLIC_SERVER_NAME]: 100,
              [client.userId]: 100,
            },
            users_default: 0,
          },
        },
        {
          type: organRoomType,
          state_key: "",
          content: {
            type: organRoomTypeValue.post,
          },
        },
        {
          type: organPostType,
          state_key: "",
          content: {
            type: organRoomTypeTree.post.text,
          },
        },
        {
          type: organPostMeta,
          state_key: "",
          content: {
            title,
            content,
            author: {
              type: "id",
              value: `!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`,
            },
            timestamp: new Date().valueOf(),
          },
        },
      ],
      invite: ["@_relay_bot:" + process.env.NEXT_PUBLIC_SERVER_NAME],
    })

    // const result = await room?.sendMessage(postEvent)

    const homeRevalidate = await fetch("/api/revalidate?path=/")
    const idRevalidate = await fetch(`/api/revalidate?path=/id/${slug}`)

    // const dispatchEmails = await fetch("/api/email-dispatch", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     roomId: room?.roomId,
    //     post: postEvent
    //   })
    // })

    location.reload()
    // redirect(`/orgs/${params.slug}`)
  }

  return (
    <div className="border-primary mb-6 flex flex-col gap-2 rounded-lg border bg-white p-3 drop-shadow-sm">
      {imageSrcs[0] && (
        <div className="flex grow items-center justify-center">
          <img
            src={imageSrcs[0]}
            alt="post"
            key={imageSrcs[0]}
            className="h-72"
          />
        </div>
      )}
      <form onSubmit={handlePostSubmit} className="flex grow flex-col gap-2">
        <div className="flex flex-wrap gap-1 gap-y-2">
          <PostTypeButton type={type} thisType="post" setType={setType}>
            <IconNorthStar size={16} /> Post
          </PostTypeButton>
          <PostTypeButton type={type} thisType="event" setType={setType}>
            <IconCalendarEvent size={16} /> Event
          </PostTypeButton>
          {(title || type === "event") && (
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

          <div className="flex flex-wrap items-center gap-2">
            {type === "event" && (
              <>
                <input
                  type="date"
                  value={startDate}
                  onChange={e =>
                    setStartDate(toValidDateString(new Date(e.target.value)))
                  }
                  className="border-primary focus:outline-primary border bg-white px-1 font-medium text-[#8258ff] text-opacity-50 focus:outline-dashed focus:outline-1"
                />
                {!allDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => {
                      // console.log("e", e)
                      setStartTime(e.currentTarget.value)
                    }}
                    step="300"
                    className="border-primary focus:outline-primary border bg-white px-1 font-medium text-[#8258ff] text-opacity-50 focus:outline-dashed focus:outline-1"
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
                    className="outline-primary checked:bg-primary mr-1 outline-4"
                  />
                </label>
              </>
            )}

            <div className="ml-auto flex items-center justify-end gap-2">
              <UploadImageButton
                imageSrcs={imageSrcs}
                setImageSrcs={setImageSrcs}
              />

              <Button
                type="submit"
                className="flex items-center gap-1 self-end rounded-[100%] border border-black border-opacity-40 bg-white px-2 py-1 text-sm hover:border-dashed">
                Share
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

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
        className="border-primary focus:outline-primary w-full border bg-white p-1 text-base placeholder:text-[#8258ff] placeholder:opacity-40 focus:outline-dashed focus:outline-1"
      />
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
        client?.uploadFile(file).then((result: any) => {
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
        className="border-primary flex cursor-pointer items-center justify-center rounded-[100%] border border-dashed px-2 py-1 text-[#9572ff]">
        {loading ? (
          <Spinner className="text-primary h-4 w-4 animate-spin fill-[#9572ff]" />
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
      className="border-primary disabled:bg-primary flex items-center gap-1 border bg-white text-sm text-[#9572ff] disabled:border-transparent disabled:text-black">
      {children}
    </Button>
  )
}
