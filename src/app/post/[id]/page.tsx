import { getContextualDate, noCacheFetch } from "@/lib/utils"
import { Client, State } from "simple-matrix-sdk"
import { Form } from "./Form"
import { Post } from "@/components/ui/Post"
import * as v from "valibot"
import { OrganPostMetaSchema } from "@/types/post"

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

  console.log("state", state)

  if ("errcode" in state) return "no state found"

  const roomType = state.get("organ.room.type")
  const postType = state.get("organ.post.type")
  const postText = state.get("organ.post.text")
  console.log("roomType", roomType, "postType", postType, "postText", postText)
  const post = state.get("organ.post.meta")?.content
  console.log("post", post)
  if (!v.is(OrganPostMetaSchema, post)) return "invalid post"

  const authorType = post.author.type
  const authorValue = post.author.value

  const authorName = await (async () => {
    if (authorType === "user") {
      const profile = await client.getProfile(authorValue)
      if (!profile || "errcode" in profile) return ""
      return profile.displayname
    } else if (authorType === "id") {
      const room = await client.getRoom(authorValue).getName()
      if ("errcode" in room) return ""
      return room.name
    }
  })()

  // const stateObject = new State(state)

  return (
    <div>
      {post.title && <h2>{post.title}</h2>}
      {authorName && <h3 className="text-base font-black">{authorName}</h3>}
      {post.timestamp && (
        <time className="">{getContextualDate(post.timestamp)}</time>
      )}
      {post.body && <p className="my-4">{post.body}</p>}
      {/* <Post post={post} id={idLocalPart} /> */}
      <Form postId={roomId} />
    </div>
  )
}
