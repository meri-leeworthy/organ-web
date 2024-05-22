import { noCacheFetch } from "@/lib/utils"
import { Client, is } from "simple-matrix-sdk"
import { Form } from "./Form"
import { Post } from "@/components/ui/Post"
import { OrganPostMetaSchema } from "@/types/post"
import { TextPost } from "@/components/ui/TextPost"
// import { TextPost } from "@/components/ui/Posts"

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX, SERVER_NAME } = process.env

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id: idLocalPart } = params
  const roomId = `!${idLocalPart}:${SERVER_NAME}`

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: { user_id: `@_relay_bot:${SERVER_NAME}` },
  })

  const postRoom = client.getRoom(roomId)
  const state = await postRoom.getState()

  // console.log("state", state)

  if ("errcode" in state) return "no state found"

  const roomType = state.get("organ.room.type")
  const postType = state.get("organ.post.type")
  const postText = state.get("organ.post.text")
  // console.log("roomType", roomType, "postType", postType, "postText", postText)
  const post = state.get("organ.post.meta")?.content
  // console.log("post", post)
  if (!is(OrganPostMetaSchema, post)) return "invalid post"

  return (
    <TextPost
      post={{
        roomId,
        postMeta: post,
        topic: post.body,
        name: post.title || "",
        roomType: "post",
        timestamp: post.timestamp || 0,
      }}
    />
  )
}
