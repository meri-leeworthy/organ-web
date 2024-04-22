import {
  organCalEventUnstable,
  organPostMeta,
  organPostUnstable,
} from "@/lib/types"
import { Post } from "@/components/ui/Post"
import { EventPost } from "@/components/ui/EventPost"
import {
  getContextualDate,
  getIdLocalPart,
  isOrganRoomType,
  props,
  slug,
} from "@/lib/utils"
import { ClientEventSchema, Event } from "simple-matrix-sdk"
import { client } from "@/lib/client"
import * as v from "valibot"
import {
  FlexGridList,
  FlexGridListItem,
  FlexList,
  FlexListItem,
} from "./FlexGridList"
import Link from "next/link"

export function Posts({ postIds }: { postIds: string[] }) {
  console.log("postIds", postIds)

  // get post state

  // const sortedPosts = postIds.sort((a, b) => {
  //   return b.originServerTs - a.originServerTs
  // })

  return (
    <section className="">
      <FlexList>
        {postIds.map((id, i) => {
          return <TextPost key={i} id={id} />
        })}
      </FlexList>

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
  if (!validPost) return null
  const post = state.get(organPostMeta)
  if (!post) return "no post"

  const body = props(post, "content", "body")
  const timestamp = props(post, "content", "timestamp")
  if (typeof body !== "string" || typeof timestamp !== "number")
    return "no content"

  return (
    <Link href={`/post/${getIdLocalPart(id)}`}>
      <FlexListItem>
        <time className="text-xs uppercase">
          {getContextualDate(timestamp)}
        </time>
        <p>{body}</p>
      </FlexListItem>
    </Link>
  )
}
