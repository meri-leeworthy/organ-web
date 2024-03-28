import { client } from "@/lib/client"
import { isOrganRoomType, props } from "@/lib/utils"
import { IconCalendarEvent } from "@tabler/icons-react"

const { SERVER_NAME } = process.env

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
  if ("errcode" in state) return JSON.stringify(state)
  if (!isOrganRoomType(state, "page", "event")) return "incorrect room type"

  const topicEvent = state.get("m.room.topic")
  const topic = props(topicEvent, "content", "topic")

  const metaEvent = state.get("organ.page.event.meta")
  if (!metaEvent) return "no meta event"

  const start = props(metaEvent, "content", "start")
  const end = props(metaEvent, "content", "end")
  const allDay = props(metaEvent, "content", "allDay")
  const location = props(metaEvent, "content", "location", "value")
  const url = props(metaEvent, "content", "url")

  return (
    <>
      <h1 className="flex items-center gap-2">
        <IconCalendarEvent />
        {nameResult.name}
      </h1>

      <p>{typeof topic === "string" && topic}</p>

      <p>Start: {typeof start === "string" && start}</p>
      <p>End: {typeof end === "string" && end}</p>
      <p>All Day: {typeof allDay === "boolean" && allDay.toString()}</p>
      <p>Location: {typeof location === "string" && location}</p>
      <p>URL: {typeof url === "string" && url}</p>
    </>
  )
}
