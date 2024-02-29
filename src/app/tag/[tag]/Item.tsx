import { client } from "@/lib/client"
import { Room } from "simple-matrix-sdk"

export async function Item({ postRoomId }: { postRoomId: string }) {
  const postRoom = new Room(postRoomId, client)
  const state = await postRoom.getState()
  console.log("state", state)
  if ("errcode" in state) return "no state"
  const roomType = state.get("organ.room.type")
  if (!roomType || roomType.content.type !== "post") return "not a post room"
  const postType = state.get("organ.post.type")
  if (!postType) return "not a post room"
  if (postType.content.type !== "text") return "not a text post"
  const postText = state.get("organ.post.text")
  console.log("roomType", roomType)
  return (
    <li>
      <p>{postText.content.value}</p>
      {/* <h1>{postRoom.name}</h1>
      <p>{postRoom.description}</p> */}
    </li>
  )
}
