import { Post } from "@/components/ui/Post"
import { EventPost } from "@/components/ui/EventPost"
import {
  getContextualDate,
  getIdLocalPart,
  isOrganRoomType,
  props,
  slug,
} from "@/lib/utils"
import { client } from "@/lib/client"
import * as v from "valibot"
import { FlexGridList, FlexGridListItem } from "./FlexGridList"
import Link from "next/link"
import { IconCalendarEvent, IconTag } from "@tabler/icons-react"
import { organCalEventMeta } from "@/types/event"

export function Events({ postIds }: { postIds: string[] }) {
  console.log("postIds", postIds)

  // get post state

  // const sortedPosts = postIds.sort((a, b) => {
  //   return b.originServerTs - a.originServerTs
  // })

  return (
    <section className="">
      <FlexGridList>
        {postIds.map((id, i) => {
          return <Event key={i} id={id} />
        })}
      </FlexGridList>

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

export async function Event({ id }: { id: string }) {
  const room = client.getRoom(id)
  const state = await room.getState()
  if ("errcode" in state) return JSON.stringify(state)
  console.log(id, "state", state)
  console.log("roomtype", state.get("organ.room.type"))
  const validPost = isOrganRoomType(state, "event")
  if (!validPost) return null
  const event = state.get(organCalEventMeta)
  if (!event) return "no event"

  const nameEvent = state.get("m.room.name")
  const name = props(nameEvent, "content", "name")
  if (typeof name !== "string") return "no name"

  const topicEvent = state.get("m.room.topic")
  const topic = props(topicEvent, "content", "topic")
  if (typeof topic !== "string") return "no topic"

  const start = props(event, "content", "start")
  const end = props(event, "content", "end")
  if (typeof start !== "string" || typeof end !== "string") return "no content"

  // const date = new Date(timestamp)

  const date = getContextualDate(parseInt(start))

  return (
    <Link href={"/event/" + getIdLocalPart(id)}>
      <FlexGridListItem>
        <time className="text-xs uppercase">{date}</time>
        <h3 className="flex items-start gap-1 font-medium">
          {/* <IconCalendarEvent className="m-1" size={20} /> */}
          {name}
        </h3>
        <p>{topic}</p>
        {/* <time className="text-xs uppercase">{getContextualDate(timestamp)}</time> */}
      </FlexGridListItem>
    </Link>
  )
}
