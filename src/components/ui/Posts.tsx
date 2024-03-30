import {
  organCalEventUnstable,
  organPostMeta,
  organPostUnstable,
} from "@/lib/types"
import { Post } from "@/components/ui/Post"
import { EventPost } from "@/components/ui/EventPost"
import { isOrganRoomType, props, slug } from "@/lib/utils"
import { ClientEventSchema, Event } from "simple-matrix-sdk"
import { client } from "@/lib/client"
import * as v from "valibot"

export function Posts({ postIds }: { postIds: string[] }) {
  console.log("postIds", postIds)

  // get post state

  // const sortedPosts = postIds.sort((a, b) => {
  //   return b.originServerTs - a.originServerTs
  // })

  return (
    <section className="">
      {postIds.map((id, i) => {
        return <TextPost key={i} id={id} />
      })}

      {/* {sortedPosts.map((post, i) => {
        const content = post.content
        const originServerTs = post.originServerTs
        const eventId = post.eventId

        const postSlug = slug(post.roomId)

        if (
          !post ||
          !content ||
          typeof content !== "object" ||
          content === null ||
          !("msgtype" in content) ||
          (post.edits && post.edits.size > 0)
        )
          return null

        switch (content?.msgtype) {
          case organPostUnstable:
            return (
              <Post
                key={i}
                content={content}
                timestamp={originServerTs}
                id={eventId.split("$")[1]}
                slug={postSlug}
              />
            )
          case organCalEventUnstable:
            return (
              <EventPost
                key={i}
                content={content}
                timestamp={originServerTs}
                id={eventId.split("$")[1]}
                slug={postSlug}
              />
            )
        }
      })} */}
    </section>
  )
}

async function TextPost({ id }: { id: string }) {
  const room = client.getRoom(id)
  const state = await room.getState()
  if ("errcode" in state) return JSON.stringify(state)
  console.log(id, "state", state)
  console.log("roomtype", state.get("organ.room.type"))
  const validPost = isOrganRoomType(state, "post")
  if (!validPost) return "incorrect room type"
  const post = state.get(organPostMeta)
  if (!post) return "no post"
  const body = props(post, "content", "body")
  if (typeof body !== "string") return "no content"

  return (
    <div>
      <p>{body}</p>
    </div>
  )
}
