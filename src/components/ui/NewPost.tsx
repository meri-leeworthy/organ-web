/* eslint-disable @next/next/no-img-element */
"use client"

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
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
  organSpaceType,
  organSpaceTypeValue,
} from "@/types/schema"

import { TimePicker as AntDTimePicker, ConfigProvider } from "antd"
import { Room } from "simple-matrix-sdk"
import {
  IconCalendarEvent,
  IconClock,
  IconNorthStar,
  IconX,
} from "@tabler/icons-react"
// import { SelectAuthor } from "@/components/SelectAuthor"
// import Link from "next/link"
import { toValidDateString } from "@/lib/utils"
import { Input, Textarea, Button } from "../styled"
import { Input as SCNInput } from "./input"
import { OrganPostMetaState, organPostMeta } from "@/types/post"
import { organCalEventMeta } from "@/types/event"
import { UploadImageButton } from "./UploadImageButton"
import { DatePicker } from "./DatePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { StateEvent } from "@/types/utils"
import { Dialog, DialogContent, DialogTrigger } from "./dialog"
import { OrganEntity } from "@/types/schema"
import { useRoom } from "@/hooks/useRoom"

export const NewPost = ({ slug }: { slug: string }) => {
  return (
    <div className="flex justify-center gap-2">
      <Dialog>
        <DialogTrigger>
          <Button className="flex items-center gap-1 border-transparent bg-white text-sm hover:border-primary">
            <IconNorthStar size={16} /> Create New Post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <h2>New Post</h2>
          <PostForm slug={slug} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const PostForm = ({
  slug,
  post,
}: {
  slug: string
  post?: OrganEntity
}) => {
  const authorRoomId =
    post?.postMeta?.author && post.postMeta.author.type === "id"
      ? post.postMeta.author.value
      : null
  const authorRoom = useRoom(authorRoomId || "")

  const [title, setTitle] = useState(post?.postMeta?.title || "")
  const [content, setContent] = useState(post?.postMeta?.body || "")
  const [imageSrcs, setImageSrcs] = useState<string[]>([])
  const [author, setAuthor] = useState<[Room, string] | null>(
    authorRoomId && authorRoom ? [authorRoom, authorRoomId] : null
  )

  const client = useClient()
  const room = useMemo(() => {
    if (!client) return
    return client.getRoom(`!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`)
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
    event.preventDefault()

    if (!author) return
    const [authorRoom, authorName] = author
    const roomId = authorRoom.roomId

    const postMetaState: (
      | OrganPostMetaState
      | StateEvent<string, { value: string }>
    )[] = [
      {
        type: organRoomType,
        content: {
          value: organRoomTypeValue.post,
        },
      },
      {
        type: organPostType,
        content: {
          value: organRoomTypeTree.post.text,
        },
      },
      {
        type: organPostMeta,
        content: {
          title,
          body: content,
          timestamp: new Date().valueOf(),
          author: {
            type: "id",
            value: `!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`,
          },
        },
      },
    ]

    const newPostRoomResult = await client?.createRoom({
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
          type: "m.space.parent",
          state_key: `!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`,
          content: {
            via: [process.env.NEXT_PUBLIC_SERVER_NAME],
          },
        },
        ...postMetaState,
      ],
      invite: ["@_relay_bot:" + process.env.NEXT_PUBLIC_SERVER_NAME],
    })

    if (
      !newPostRoomResult ||
      (typeof newPostRoomResult === "object" && "errcode" in newPostRoomResult)
    )
      return newPostRoomResult

    const adoptionResult = await room?.sendStateEvent(
      "m.space.child",
      { via: [process.env.NEXT_PUBLIC_SERVER_NAME] },
      `${newPostRoomResult.roomId}`
    )

    console.log("adoptionResult", adoptionResult)

    const join = await fetch(`/api/join?roomId=${newPostRoomResult.roomId}`)
      .then(res => res.json())
      .then(console.log)
      .catch(console.error)
    console.log("join", join)

    // const result = await room?.sendMessage(postEvent)

    // send to postsBus via api call
    const postsBusId = await fetch("/api/bus", {
      method: "POST",
      body: JSON.stringify({
        type: "post",
        value: newPostRoomResult.roomId,
      }),
    })

    console.log("postsBusId", postsBusId)

    const homeRevalidate = await fetch("/api/revalidate?path=/")
    // const idRevalidate = await fetch(`/api/revalidate?path=/id/${slug}`) // should be alias

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
    <div className="border-primary mb-6 flex flex-col gap-2 max-w-xl drop-shadow-sm">
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
          <SCNInput
            type="text"
            id="title"
            placeholder="Title"
            aria-label="title"
            value={title}
            onChange={e => setTitle((e.target as HTMLInputElement).value)}
          />
        </div>
        <Description type={"post"} content={content} setContent={setContent} />

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
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

export const NewEventForm = ({ slug }: { slug: string }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  // const [startTime, setStartTime] = useState("00:00")
  const [endDate, setEndDate] = useState(toValidDateString(new Date()))
  const [endTime, setEndTime] = useState("00:00")
  const [place, setPlace] = useState("")
  const [imageSrcs, setImageSrcs] = useState<string[]>([])
  const [author, setAuthor] = useState<[Room, string]>()
  const [allDay, setAllDay] = useState(false)

  // const [hours, minutes] = startTime.split(":").map(Number)

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
    event.preventDefault()

    if (!author) return
    const [authorRoom, authorName] = author
    const roomId = authorRoom.roomId

    const eventMetaState = [
      {
        type: organSpaceType,
        content: {
          value: organSpaceTypeValue.event,
        },
      },
      {
        type: organCalEventMeta,
        content: {
          start: startDate,
          end: endDate,
          location,
          allDay,
        },
      },
    ]

    const newPostRoomResult = await client?.createRoom({
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
          type: "m.space.parent",
          state_key: `!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`,
          content: {
            via: [process.env.NEXT_PUBLIC_SERVER_NAME],
          },
        },
        ...eventMetaState,
      ],
      invite: ["@_relay_bot:" + process.env.NEXT_PUBLIC_SERVER_NAME],
    })

    if (
      !newPostRoomResult ||
      (typeof newPostRoomResult === "object" && "errcode" in newPostRoomResult)
    )
      return newPostRoomResult

    const adoptionResult = await room?.sendStateEvent(
      "m.space.child",
      { via: [process.env.NEXT_PUBLIC_SERVER_NAME] },
      `${newPostRoomResult.roomId}`
    )

    console.log("adoptionResult", adoptionResult)

    const join = await fetch(`/api/join?roomId=${newPostRoomResult.roomId}`)
      .then(res => res.json())
      .then(console.log)
      .catch(console.error)
    console.log("join", join)

    // const result = await room?.sendMessage(postEvent)

    // send to postsBus via api call
    const postsBusId = await fetch("/api/bus", {
      method: "POST",
      body: JSON.stringify({
        type: "post",
        value: newPostRoomResult.roomId,
      }),
    })

    console.log("postsBusId", postsBusId)

    const homeRevalidate = await fetch("/api/revalidate?path=/")
    // const idRevalidate = await fetch(`/api/revalidate?path=/id/${slug}`) // should be alias

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
    <div className="border-primary mb-6 flex flex-col gap-2 max-w-xl drop-shadow-sm">
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
          <SCNInput
            type="text"
            id="title"
            placeholder="Title"
            aria-label="title"
            value={title}
            onChange={e => setTitle((e.target as HTMLInputElement).value)}
          />
        </div>
        <Description type={"event"} content={content} setContent={setContent} />

        <div className="flex flex-col gap-2">
          <SCNInput
            type="text"
            id="location"
            placeholder="Location"
            aria-label="location"
            value={place}
            onChange={e => setPlace((e.target as HTMLInputElement).value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <DatePicker startDate={startDate} setStartDate={setStartDate} />
            {!allDay && <TimePicker />}

            <label className="flex items-center gap-1 ml-2 text-xs uppercase opacity-80">
              <input
                type="checkbox"
                id="allday"
                name="allday"
                checked={allDay}
                onChange={e => setAllDay(e.target.checked)}
                className="outline-primary checked:bg-primary mr-1 outline-4"
              />
              All Day
            </label>

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

function TimePicker() {
  const containerRef = useRef(null)

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextPlaceholder: "#8258ff80",
          controlItemBgActive: "rgb(221 210 255 / 1)",
        },
        components: {
          DatePicker: {
            hoverBorderColor: "#000",
            activeBorderColor: "#000",
            cellActiveWithRangeBg: "rgb(221 210 255 / 0.5)",
          },
        },
      }}>
      <div
        ref={containerRef}
        style={{ position: "relative" }}
        className="my-time-picker"
      />
      <AntDTimePicker
        use12Hours
        suffixIcon={
          <IconClock size={16} className="text-primarydark text-opacity-50" />
        }
        clearIcon={
          <IconX size={16} className="text-primarydark text-opacity-50" />
        }
        removeIcon={
          <IconX size={16} className="text-primarydark text-opacity-50" />
        }
        format="h:mm a"
        getPopupContainer={() => {
          if (!containerRef.current) return document.body
          console.log("containerRef", containerRef.current)
          return containerRef.current
        }}
        minuteStep={5}
        needConfirm={false}
        className="rounded-none my-time-picker border-primary hover:border-primary font-sans"
        popupStyle={{
          boxShadow: "none",
          border: "1px solid rgb(221 210 255 / 1)",
          borderRadius: "0",
          zIndex: 1070,
          backgroundColor: "white",
        }}
        // popupClassName="*:rounded-none border-primary hover:border-primary font-sans"
      />
    </ConfigProvider>
  )
}

export function Description(props: {
  type: "post" | "event"
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
      />
    </div>
  )
}
