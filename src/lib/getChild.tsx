import { client } from "@/lib/client"
import { props } from "@/lib/utils"
import { OrganPageEventMeta, organPageEventMeta } from "@/types/event"
import {
  RoomTypes,
  organPageType,
  organRoomTypeTree,
  organSpaceType,
} from "@/types/schema"
import { OrganPostMeta } from "@/types/post"
import { SubTypes } from "@/types/utils"

// Show descriptive content from 'tag page' room
// fetch all children state here and pass it to the children
// define relevant state as simple objects and not classes

export async function getChild(
  roomId: string,
  alias?: string
): Promise<Child | null> {
  console.log("roomId", roomId)
  const state = await client.getRoom(roomId).getState()
  if ("errcode" in state) {
    console.log("no state")
    return null
  }

  const child: Record<string, any> = { roomId }

  alias && (child["alias"] = alias)
  const nameEvent = state.get("m.room.name")
  child["name"] = props(nameEvent, "content", "name")
  const topicEvent = state.get("m.room.topic")
  child["topic"] = props(topicEvent, "content", "topic")
  const roomTypeEvent =
    state.get(organSpaceType) || state.get("organ.room.type")
  child["roomType"] = props(roomTypeEvent, "content", "value")
  if (child["roomType"] === "page") {
    const pageTypeEvent = state.get(organPageType)
    child["pageType"] = props(pageTypeEvent, "content", "value")
    if (child["pageType"] === organRoomTypeTree.page.event) {
      const eventMetaEvent = state.get(organPageEventMeta)
      child["eventMeta"] = props(eventMetaEvent, "content")
    }
  }
  if (child["roomType"] === "post") {
    const postTypeEvent = state.get("organ.post.type")
    child["postType"] = props(postTypeEvent, "content", "value")
    const postMetaEvent = state.get("organ.post.meta")
    child["postMeta"] = props(postMetaEvent, "content")
  }
  child["timestamp"] = state.get("m.room.create")?.origin_server_ts

  return child as Child
}
export type Child = {
  roomId: string
  name: string
  topic: string
  roomType: RoomTypes
  pageType?: SubTypes<"page">
  postType?: SubTypes<"post">
  alias?: string
  eventMeta?: OrganPageEventMeta
  postMeta?: OrganPostMeta
  timestamp?: number
}
