import { getChild } from "@/lib/getChild"
import { OrganEntity } from "@/types/schema"
import { Posts } from "@/components/ui/Posts"
import { client } from "@/lib/client"
import { getContextualDate, isOrganRoomType, props } from "@/lib/utils"
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react"
import { State } from "simple-matrix-sdk"

const { SERVER_NAME } = process.env

// TODO: handle urls
// TODO: handle allDay
// TODO: posts in event
// TODO: rsvps

export default async function EventPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const roomId = `!${id}:${SERVER_NAME}`

  console.log("roomId", roomId)
  const room = client.getRoom(roomId)

  const nameResult = await room.getName()
  if ("errcode" in nameResult) return JSON.stringify(nameResult)

  const state = await room.getState()
  console.log("state", state)

  if ("errcode" in state) return JSON.stringify(state)
  if (!isOrganRoomType(state, "event")) return "incorrect room type"

  const topicEvent = state.get("m.room.topic")
  const topic = props(topicEvent, "content", "topic")

  const metaEvent = state.get("organ.page.event.meta")
  if (!metaEvent) return "no meta event"

  const start = props(metaEvent, "content", "start")
  const end = props(metaEvent, "content", "end")
  const allDay = props(metaEvent, "content", "allDay")
  const location = props(metaEvent, "content", "location", "value")
  const url = props(metaEvent, "content", "url")

  const children = state.getAll("m.space.child")

  const posts = (await Promise.all(
    [...(children ? children.keys() : [])]
      .map(
        async childId => await getChild(childId)
        // async childId => await client.getRoom(childId).getState()
      )
      .filter(Boolean)
  )) as OrganEntity[]

  // const postsState = (
  //   childrenState.filter(childState => !("errcode" in childState)) as State[]
  // ).filter(
  //   childState =>
  //     isOrganRoomType(childState, "post", "text") &&
  //     childState.get("organ.post.meta")?.content
  // )

  // const posts: Child[] = postsState.map(roomState => {
  //   const post = roomState.get("organ.post.meta")?.content as {
  //     title: string
  //     body: string
  //     timestamp: number
  //   }
  //   console.log("post", post)
  //   return {
  //     roomId: "roomState.roomId",
  //     roomType: "post",
  //     name: post!.title,
  //     topic: post.body,
  //     timestamp: post.timestamp,
  //   }
  // })

  const childIds = children ? [...children.keys()] : []

  if (typeof start !== "string" || typeof end !== "string") return "no date"

  const startDate = new Date(parseInt(start))
  const endDate = new Date(parseInt(end))

  const dateTimeOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: undefined,
  } as const

  const timeOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: undefined,
  } as const

  return (
    <>
      <h1 className="flex items-center gap-2 pb-4 font-bold">
        {nameResult.name}
      </h1>

      <p className="flex items-center gap-2 text-sm">
        <IconCalendarEvent size={12} />
        {typeof start === "string" && getContextualDate(parseInt(start))}
        <time className="text-xs uppercase ml-6">
          {startDate.toLocaleString("en-AU", dateTimeOptions)} -{" "}
          {startDate.toLocaleDateString("en-AU") !==
          endDate.toLocaleDateString("en-AU")
            ? endDate.toLocaleString("en-AU", dateTimeOptions)
            : endDate.toLocaleTimeString("en-AU", timeOptions)}
        </time>
      </p>

      <p className="flex gap-2 items-center text-sm">
        <IconMapPin size={12} />
        {typeof location === "string" && location}
      </p>

      <p className="py-4">{typeof topic === "string" && topic}</p>

      <Posts posts={posts} />
    </>
  )
}
