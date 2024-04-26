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
import { organPostMeta } from "@/types/post"
import { Child } from "@/lib/getChild"

export function Posts({ posts }: { posts: Child[] }) {
  console.log("postIds", posts)

  // get post state

  // const sortedPosts = postIds.sort((a, b) => {
  //   return b.originServerTs - a.originServerTs
  // })

  return (
    <section className="">
      <FlexList>
        {posts.map((post, i) => {
          return <TextPost key={i} post={post} />
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

async function TextPost({ post }: { post: Child }) {
  // const room = client.getRoom(id)
  // const state = await room.getState()
  // if ("errcode" in state) return JSON.stringify(state)
  // console.log(id, "state", state)
  // console.log("roomtype", state.get("organ.room.type"))
  // const validPost = isOrganRoomType(state, "post")
  // if (!validPost) return null
  // const post = state.get(organPostMeta)
  // if (!post) return "no post"

  // const body = props(post, "content", "body")
  // const timestamp = props(post, "content", "timestamp")
  // if (typeof body !== "string" || typeof timestamp !== "number")
  //   return "no content"

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
    <Link href={`/post/${getIdLocalPart(post.roomId)}`}>
      <FlexListItem>
        {post.postMeta!.title && (
          <h2 className="font-serif">{post.postMeta!.title}</h2>
        )}
        <div className="flex items-baseline gap-2">
          {authorName && <h3 className="font-medium text-sm">{authorName}</h3>}
          {post.timestamp && (
            <time className="text-xs uppercase">
              {getContextualDate(post.postMeta!.timestamp)}
            </time>
          )}
        </div>
        <p>{post.topic}</p>
      </FlexListItem>
    </Link>
  )
}
