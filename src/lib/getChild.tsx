import { client } from "@/lib/client"
import { props } from "@/lib/utils"
import { organCalEventMeta } from "@/types/event"
import {
  organPageType,
  organRoomType,
  organRoomTypeTree,
  organSpaceType,
} from "@/types/schema"
import { OrganEntity } from "@/types/schema"

// Show descriptive content from 'tag page' room
// fetch all children state here and pass it to the children
// define relevant state as simple objects and not classes

export async function getChild(
  roomId: string,
  alias?: string
): Promise<OrganEntity | null> {
  console.log("roomId", roomId)
  const state = await client.getRoom(roomId).getState()
  if ("errcode" in state) {
    console.log("no state")
    console.log("state", state)
    return null
  }

  // console.log("state", state)
  // console.log("state.get(organSpaceType)", state.get(organSpaceType))
  // console.log("state.get(organRoomType)", state.get(organRoomType))

  const child: Record<string, any> = { roomId }

  if (!alias) {
    const aliasEvent = state.get("m.room.canonical_alias")
    const maybeAlias = props(aliasEvent, "content", "alias")
    alias = typeof maybeAlias === "string" ? maybeAlias : undefined
  }

  alias && (child["alias"] = alias)
  const nameEvent = state.get("m.room.name")
  child["name"] = props(nameEvent, "content", "name")
  const topicEvent = state.get("m.room.topic")
  child["topic"] = props(topicEvent, "content", "topic")
  const roomTypeEvent = state.get(organSpaceType) || state.get(organRoomType)
  console.log("roomTypeEvent", roomTypeEvent)
  child["roomType"] = props(roomTypeEvent, "content", "value")
  if (child["roomType"] === "page") {
    const pageTypeEvent = state.get(organPageType)
    child["pageType"] = props(pageTypeEvent, "content", "value")
    if (child["pageType"] === organRoomTypeTree.event) {
      const eventMetaEvent = state.get(organCalEventMeta)
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

  return child as OrganEntity
}
