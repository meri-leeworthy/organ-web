import {
  getContextualDate,
  getIdLocalPart,
  noCacheFetch,
  normaliseTagString,
} from "@/lib/utils"
import { Client, State } from "simple-matrix-sdk"
import { Form } from "./Form"
import { Post } from "@/components/ui/Post"
import * as v from "valibot"
import { OrganPostMetaSchema } from "@/types/post"
import { Child } from "@/lib/getChild"
import { client } from "@/lib/client"
import { PostMenu } from "@/components/ui/PostMenu"
import { Avatar } from "@/components/ui/Avatar"
import Link from "next/link"
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
    <div className="z-10 mt-10 flex flex-col items-center">
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
    </div>
  )
}

export async function TextPost({ post }: { post: Child }) {
  const authorType = post.postMeta!.author.type
  const authorValue = post.postMeta!.author.value

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

  return (
    <div className="max-w-md">
      {post.postMeta!.title && (
        <h2 className="font-serif">{post.postMeta!.title}</h2>
      )}
      <div className="flex mb-1">
        <div className="flex gap-2">
          {authorName && (
            <>
              <Avatar name={authorName} />
              <div className="flex flex-wrap items-center gap-x-2">
                <Link href={`/id/${normaliseTagString(authorName)}`}>
                  <h3 className="font-medium text-sm">{authorName}</h3>
                </Link>
                {post.timestamp && (
                  <time className="text-xs uppercase">
                    {getContextualDate(post.postMeta!.timestamp)}
                  </time>
                )}
              </div>
            </>
          )}
        </div>
        <div className="ml-auto">
          <PostMenu
            authorSlug={getIdLocalPart(post.postMeta?.author.value || "")}
            post={post}
          />
        </div>
      </div>
      <p className="whitespace-pre-line">{post.topic}</p>
      {/* <Form postId={post.roomId} /> */}
    </div>
  )
}
