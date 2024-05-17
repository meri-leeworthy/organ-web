import { Post } from "@/components/ui/Post"
import { EventPost } from "@/components/ui/EventPost"
import {
  getContextualDate,
  getIdLocalPart,
  isOrganRoomType,
  normaliseTagString,
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
import { OrganEntity } from "@/types/schema"
import { IfModerator } from "../IfModerator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { PostMenu } from "./PostMenu"
import { Avatar } from "./Avatar"
import { Suspense } from "react"

export function Posts({ posts }: { posts: OrganEntity[] }) {
  // console.log("posts", posts)

  // get post state

  // const sortedPosts = postIds.sort((a, b) => {
  //   return b.originServerTs - a.originServerTs
  // })

  return (
    <section className="">
      <Suspense fallback={<div>Loading...</div>}>
        <FlexList>
          {posts.map((post, i) => {
            return (
              <Link href={`/post/${getIdLocalPart(post.roomId)}`} key={i}>
                <TextPost post={post} />
              </Link>
            )
          })}
        </FlexList>
      </Suspense>

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

export async function TextPost({ post }: { post: OrganEntity }) {
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

  const authorType = post.postMeta?.author?.type || ""
  const authorValue = post.postMeta?.author?.value || ""

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
    <FlexListItem>
      {post.postMeta?.title && (
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
    </FlexListItem>
  )
}
