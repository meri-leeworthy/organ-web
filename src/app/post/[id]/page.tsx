import { noCacheFetch } from "@/lib/utils"
import { Client, State } from "simple-matrix-sdk"
import { Form } from "./Form"

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

  // console.log("state", state)

  if ("errcode" in state) return "no state found"

  // const stateObject = new State(state)

  return (
    <div>
      <h1>Post {idLocalPart}</h1>
      <p>Room type: {state.get("organ.room.type")?.type}</p>
      <p>Post(?) type: {state.get("organ.post.type")?.type}</p>
      <p>Post text(?): {state.get("organ.post.text")?.value}</p>
      <h2>Add tag:</h2>
      <Form postId={roomId} />
    </div>
  )
}
