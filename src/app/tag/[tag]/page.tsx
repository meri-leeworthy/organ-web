import { getTagRoomId } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { IconTag } from "@tabler/icons-react"
import { Child, ChildrenCarousel } from "@/components/ui/ChildrenCarousel"
import { props } from "@/lib/utils"
import { organPageEventMeta } from "@/types/event"
import {
  organPageType,
  organRoomTypeTree,
  organSpaceType,
} from "@/types/schema"
import { FlexGridList } from "@/components/ui/FlexGridList"
import { Item } from "@/components/ui/Item"
import { Posts } from "@/components/ui/Posts"

// TODO: only show future events
// TODO: show events in a carousel
// TODO: show posts

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

  return child as Child
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params

  const tagRoomId = await getTagRoomId(tag)
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId)
    return JSON.stringify(tagRoomId)

  console.log("tagRoomId", tagRoomId)

  const tagRoom = client.getRoom(tagRoomId)
  const name = await tagRoom.getName()
  if ("errcode" in name) return JSON.stringify(name)

  const tagChildren = await tagRoom.getHierarchy({ max_depth: 1 })

  tagChildren?.shift()

  console.log("tagChildren", tagChildren)

  const allChildren = (
    tagChildren
      ? await Promise.all(
          tagChildren.map(
            async child => await getChild(child.room_id, child.canonical_alias)
          )
        )
      : []
  ).filter(Boolean) as Child[]

  const events = allChildren.filter(
    child =>
      "pageType" in child &&
      child["pageType"] === "event" &&
      child["eventMeta"].start > Date.now()
  )

  const ids = allChildren.filter(
    child => "pageType" in child && child["pageType"] === "id"
  )

  const posts = allChildren.filter(
    child => "roomType" in child && child["roomType"] === "post"
  )

  console.log("posts", posts)

  return (
    <div>
      <h1 className="inline-flex px-3 py-1 rounded-full items-center gap-2 border border-green-400">
        <IconTag />
        {name.name}
      </h1>

      {events && (
        <>
          <h2 className="mt-6">Upcoming Events</h2>
          <ChildrenCarousel spaceChildren={events as Child[]} />
        </>
      )}

      {ids && (
        <>
          <h2>Groups</h2>
          <ChildrenCarousel spaceChildren={ids as Child[]} />
        </>
      )}

      {posts && (
        <>
          <h2>Posts</h2>
          <Posts posts={posts || []} />
        </>
      )}
    </div>
  )
}
