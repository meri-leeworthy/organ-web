import { client } from "@/lib/client"
import { props } from "@/lib/utils"
import { Room } from "simple-matrix-sdk"

export async function Item({ postRoomId }: { postRoomId: string }) {
  const postRoom = new Room(postRoomId, client)
  const state = await postRoom.getState()
  console.log("state", state)
  if ("errcode" in state) return "no state"
  const roomTypeEvent = state.get("organ.room.type")
  if (!roomTypeEvent) return "not a post room"
  const { content: roomType } = roomTypeEvent
  if (
    !roomType ||
    typeof roomType !== "object" ||
    !("type" in roomType) ||
    !("value" in roomType)
  )
    return "not a post room"
  if (roomType?.type !== "post") return "not a post room"

  const postTypeEvent = state.get("organ.post.type")
  if (!postTypeEvent) return "not a post room"
  const { content: postType } = postTypeEvent
  if (!postType || typeof postType !== "object" || !("type" in postType))
    return "not a post room"
  if (postType.type !== "text") return "not a text post"
  const postText = state.get("organ.post.text")
  const text = props(postText, "content", "value")
  console.log("roomType", roomType)
  return (
    <li>
      <p>{typeof text === "string" && text}</p>
      {/* <h1>{postRoom.name}</h1>
      <p>{postRoom.description}</p> */}
    </li>
  )
}
