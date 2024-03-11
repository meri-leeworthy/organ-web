import { noCacheFetch } from "@/lib/utils"
import { Client, State } from "simple-matrix-sdk"
import { Form } from "./Form"
import { Post } from "@/components/ui/Post"

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX } = process.env

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id: idLocalPart } = params
  const roomId = `!${idLocalPart}:radical.directory`

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: { user_id: `@_relay_bot:radical.directory` }
  })

  const postRoom = client.getRoom(roomId)
  const state = await postRoom.getState()

  console.log("state", state)

  if ("errcode" in state) return "no state found"

  const roomType = state.get("organ.room.type")
  const postType = state.get("organ.post.type")
  const postText = state.get("organ.post.text")
  console.log("roomType", roomType, "postType", postType, "postText", postText)
  const post = state.get("organ.post.meta")?.content
  console.log("post", post.content)

  // const stateObject = new State(state)

  return (
    <div>
      <Post post={post} id={idLocalPart} />
      <h2>Add tag:</h2>
      <Form postId={roomId} />
    </div>
  )
}
