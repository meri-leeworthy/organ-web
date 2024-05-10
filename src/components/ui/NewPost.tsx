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

type PostType = "post" | "event"

export const NewPost = ({ slug }: { slug: string }) => {
  const [type, setType] = useState<PostType>("post")
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

    const postOrEventMetaState =
      type === "post" ? postMetaState : eventMetaState

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
        ...postOrEventMetaState,
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
          <PostTypeButton type={type} thisType="post" setType={setType}>
            <IconNorthStar size={16} /> Post
          </PostTypeButton>
          <PostTypeButton type={type} thisType="event" setType={setType}>
            <IconCalendarEvent size={16} /> Event
          </PostTypeButton>
          {(title || type === "event") && (
            <SCNInput
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
            <SCNInput
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
                <DatePicker startDate={startDate} setStartDate={setStartDate} />
                {/* <input
                  type="date"
                  value={startDate}
                  onChange={e =>
                    setStartDate(toValidDateString(new Date(e.target.value)))
                  }
                  className="border-primary focus:outline-primary border bg-white px-1 font-medium text-[#8258ff] text-opacity-50 focus:outline-dashed focus:outline-1"
                /> */}
                {!allDay && (
                  <TimePicker />
                  // <SCNInput
                  //   type="time"
                  //   value={`${startDate?.getHours() || "00"}:${
                  //     startDate?.getMinutes() || "00"
                  //   }`}
                  //   onChange={e => {
                  //     const [hours, minutes] = e.currentTarget.value
                  //       .split(":")
                  //       .map(Number)

                  //     setStartDate(startDate => {
                  //       const newStartDate = new Date(startDate as Date)
                  //       startDate?.setHours(hours)
                  //       startDate?.setMinutes(minutes)
                  //       startDate?.setSeconds(0)
                  //       startDate?.setMilliseconds(0)
                  //       return newStartDate
                  //     })
                  //   }}
                  //   step="300"
                  //   className="w-32 border-primary focus:outline-primary border bg-white font-medium text-[#8258ff] text-opacity-50 focus:outline-dashed focus:outline-1"
                  // />
                )}

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

const HTMLElementWrapper = ({ element }: { element: HTMLElement | null }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Check if element is valid
  if (!element) {
    return null // Return null if element is not valid
  }

  // Append the element to the wrapper div
  if (wrapperRef.current) {
    wrapperRef.current.appendChild(element)
  }

  // Return the wrapper div's DOM node
  return <div ref={wrapperRef} />
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

function TimePickerr() {
  return (
    <Select>
      <SelectTrigger className="w-28 rounded-none border-primary py-0 placeholder:text-[#8258ff] placeholder:text-opacity-50">
        <SelectValue placeholder="Time?" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 24 }).map((_, hourIndex) => (
          <>
            <SelectItem value={`${hourIndex}:00`} key={`${hourIndex}:00`}>
              {hourIndex % 12 === 0 ? 12 : hourIndex % 12}:00
              {hourIndex < 12 ? "am" : "pm"}
            </SelectItem>
            <SelectItem value={`${hourIndex}:15`} key={`${hourIndex}:15`}>
              {hourIndex % 12 === 0 ? 12 : hourIndex % 12}:15
              {hourIndex < 12 ? "am" : "pm"}
            </SelectItem>
            <SelectItem value={`${hourIndex}:30`} key={`${hourIndex}:30`}>
              {hourIndex % 12 === 0 ? 12 : hourIndex % 12}:30
              {hourIndex < 12 ? "am" : "pm"}
            </SelectItem>
            <SelectItem value={`${hourIndex}:45`} key={`${hourIndex}:45`}>
              {hourIndex % 12 === 0 ? 12 : hourIndex % 12}:45
              {hourIndex < 12 ? "am" : "pm"}
            </SelectItem>
          </>
        ))}
      </SelectContent>
    </Select>
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
