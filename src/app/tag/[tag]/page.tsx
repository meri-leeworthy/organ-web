import { getTagRoomId } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { props } from "@/lib/utils"
import { IconTag } from "@tabler/icons-react"
import { ClientEventSchema, Room } from "simple-matrix-sdk"
import * as v from "valibot"
import { FlexGridList, FlexGridListItem } from "@/components/ui/FlexGridList"

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

  console.log("TagChldren", tagChildren)

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <IconTag />
        {name.name}
      </h1>
      <FlexGridList>
        {tagChildren?.map((child: any) => {
          console.log("child", child)
          return <Item key={child.roomId} postRoomId={child.room_id} />
        })}
      </FlexGridList>
    </div>
  )
}

export async function Item({ postRoomId }: { postRoomId: string }) {
  const postRoom = new Room(postRoomId, client)

  const state = await postRoom.getState()
  if ("errcode" in state) return "no state"

  const spaceTypeEvent = state.get("organ.space.type")
  // if (!spaceTypeEvent) return "not a space"

  if (!v.is(ClientEventSchema, spaceTypeEvent)) return "incorrect event schema"

  const { content: spaceType } = spaceTypeEvent

  const pageTypeEvent = state.get("organ.page.type")
  // if (!pageTypeEvent) return "not a page"

  if (!v.is(ClientEventSchema, pageTypeEvent)) return "incorrect event schema"

  const { content: pageType } = pageTypeEvent
  if (
    !pageType ||
    typeof pageType !== "object" ||
    !("value" in pageType) ||
    typeof pageType.value !== "string"
  )
    return "incorrect event schema"

  // const roomTypeEvent = state.get("organ.room.type")
  // if (!roomTypeEvent) return "not a room"

  const name = (state.get("m.room.name")?.content as { name: string }).name
  const topic = (state.get("m.room.topic")?.content as { topic: string }).topic

  return pageType.value === "id" ? (
    <FlexGridListItem>
      <p className="font-bold">{name}</p>
      <p>{topic}</p>
    </FlexGridListItem>
  ) : pageType.value === "event" ? (
    <FlexGridListItem>
      <p>Event</p>
      <p>{name}</p>
      <p>{topic}</p>
    </FlexGridListItem>
  ) : null
}
