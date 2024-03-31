import { getTagRoomId } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { getIdLocalPart, props } from "@/lib/utils"
import { IconTag } from "@tabler/icons-react"
import { ClientEventSchema, Room } from "simple-matrix-sdk"
import * as v from "valibot"
import { FlexGridList, FlexGridListItem } from "@/components/ui/FlexGridList"
import Link from "next/link"
import { Event } from "@/components/ui/Events"

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
  const room = new Room(postRoomId, client)

  const state = await room.getState()
  if ("errcode" in state) return "no state"

  const aliasEvent = state.get("m.room.canonical_alias")

  const alias = props(aliasEvent, "content", "alias")

  const spaceTypeEvent = state.get("organ.space.type")
  if (!v.is(ClientEventSchema, spaceTypeEvent)) return "incorrect event schema"

  const pageTypeEvent = state.get("organ.page.type")
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

  if (pageType.value === "id") {
    if (typeof alias !== "string")
      return (
        <FlexGridListItem>
          {JSON.stringify({ alias, name, topic })}
        </FlexGridListItem>
      )
    return (
      <Link
        href={`/id/${alias.split("#relay_id_")[1].split(":")[0]}`}
        key={room.roomId}>
        <FlexGridListItem>
          <h3 className="font-medium py-1">{name}</h3>
          <p>{topic}</p>
        </FlexGridListItem>
      </Link>
    )
  }
  if (pageType.value === "event")
    return (
      <Event id={room.roomId} key={room.roomId} />
      // <Link href={"/event/" + getIdLocalPart(room.roomId)} key={room.roomId}>
      //   <FlexGridListItem>
      //     <p className="pt-2 text-xs uppercase">Event</p>
      //     <p className="font-bold">{name}</p>
      //     <p>{topic}</p>
      //   </FlexGridListItem>
      // </Link>
    )
}
