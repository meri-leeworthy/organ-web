import { client } from "@/lib/client"
import { props } from "@/lib/utils"
import { ClientEventSchema, Room, is } from "simple-matrix-sdk"
import { OrganEntity } from "@/types/schema"

export async function Item({ id }: { id: OrganEntity }) {
  const postRoom = new Room(id.roomId, client)

  const state = await postRoom.getState()
  if ("errcode" in state) return "no state"

  const spaceTypeEvent = state.get("organ.space.type")
  // if (!spaceTypeEvent) return "not a space"

  if (!is(ClientEventSchema, spaceTypeEvent)) return "incorrect event schema"

  const { content: spaceType } = spaceTypeEvent

  const roomTypeEvent = state.get("organ.room.type")
  // if (!roomTypeEvent) return "not a room"

  const name = (state.get("m.room.name")?.content as { name: string }).name
  const topic = (state.get("m.room.topic")?.content as { topic: string }).topic

  // const { content: roomType } = roomTypeEvent
  // if (
  //   !roomType ||
  //   typeof roomType !== "object" ||
  //   !("type" in roomType) ||
  //   !("value" in roomType)
  // )
  //   return "not a post room"
  // if (roomType?.type === "post") return "post room"

  // const postTypeEvent = state.get("organ.post.type")
  // if (!postTypeEvent) return "not a post room"
  // const { content: postType } = postTypeEvent
  // if (!postType || typeof postType !== "object" || !("type" in postType))
  //   return "not a post room"
  // if (postType.type !== "text") return "not a text post"
  // const postText = state.get("organ.post.text")
  // const text = props(postText, "content", "value")
  // console.log("roomType", roomType)
  return (
    <li className="my-4">
      <p>{name}</p>
      <p>{topic}</p>
      {/* <p>{typeof text === "string" && text}</p> */}
      {/* <h1>{postRoom.name}</h1>
      <p>{postRoom.description}</p> */}
    </li>
  )
}
