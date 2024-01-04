const { AS_TOKEN, MATRIX_BASE_URL } = process.env

// export const dynamic = "force-dynamic"

import { Client, Room } from "simple-matrix-sdk"
import Link from "next/link"
import { getContextualDate } from "@/lib/utils"
import { EventPost } from "@/components/ui/EventPost"
import { OrganCalEventUnstableSchema, organCalEventUnstable } from "@/lib/types"
import { Avatar } from "@/components/ui/Avatar"
import { IfLoggedIn } from "@/components/IfLoggedIn"
import { EditMenu } from "@/components/ui"
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react"
import { is } from "valibot"

export default async function EventPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  //TODO: this is a copy of PostPage needs changing (and refactor to share code?)

  const { slug, id } = params
  const roomId = `!${slug}:radical.directory`
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
    fetch,
  })

  const room = new Room(roomId, client)
  const name = await room.getName()
  const post = await room.getEvent(id)
  const avatarUrl = await room.getAvatarMxc()

  if (!is(OrganCalEventUnstableSchema, post.content))
    return "Event not valid :("

  const { content } = post

  const title = content?.title || ""
  const body = content?.body || ""
  const host = content?.host || {}

  console.log("room name", name)
  console.log("post page", post)

  if (post.content?.msgtype !== organCalEventUnstable)
    return "Post not valid :("

  const nameString =
    typeof name === "object" &&
    name !== null &&
    "name" in name &&
    typeof name.name === "string"
      ? name.name
      : ""

  return (
    // <div className="w-full">
    //   <EventPost
    //     content={post.content}
    //     timestamp={post.origin_server_ts}
    //     id={id}
    //     slug={slug}
    //   />
    //   <h1 className="py-4">{post.content?.title}</h1>
    //   <span className="opacity-60 text-sm mt-8">
    //     {getContextualDate(post.origin_server_ts)}
    //   </span>
    //   <p className="whitespace-pre-line py-2">{post.content?.body}</p>
    // </div>
    <article className="mt-6  pb-4 flex flex-col items-start">
      <Link
        href={`/id/${slug}`}
        className="bg-[#fff9] uppercase text-sm border rounded hover:border-primary px-2 py-1">
        &larr; {nameString}
      </Link>
      {/* <div className="flex items-center gap-2 w-full">
        <Avatar url={avatarUrl?.url} name={post.content?.host?.name} />

        {content?.host && (
          <>
            <h5 className="text-sm flex font-medium gap-2">
              {content?.host?.name}
            </h5>
            <span className="text-sm mr-1">posted a new event</span>
          </>
        )}
        <time className="opacity-60 text-xs uppercase">
          {getContextualDate(timestamp)}{" "}
        </time>
      </div> */}
      <div className="flex flex-col mt-2 justify-between gap-2 mb-1 px-2 w-full">
        {content.avatar && (
          <div className="flex items-center grow justify-center">
            <img
              src={content.avatar}
              alt="post"
              key={content.avatar}
              className="h-72"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex w-full">
            <h3 className="text-2xl mb-1 font-bold flex gap-2 items-center">
              {"title" in content && content.title}
            </h3>
            <div className="ml-auto">
              <IfLoggedIn>
                <EditMenu slug={slug} event_id={id} type="event" />
              </IfLoggedIn>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            <li className="flex gap-2 uppercase text-sm items-center rounded px-1 bg-orange-100">
              <IconMapPin size={12} />
              {"location" in content && content.location}
            </li>
            <li
              className={`flex gap-2 uppercase text-sm px-1 rounded items-center ${
                new Date(content.start).valueOf() > Date.now()
                  ? "bg-primary"
                  : "bg-slate-200"
              }`}>
              <IconCalendarEvent size={12} />
              {getContextualDate(new Date(content.start).valueOf())}
              {/* {new Intl.DateTimeFormat("en-AU").format(new Date(timestamp))} */}
            </li>
          </ul>
        </div>

        <p className="whitespace-pre-line">{content.body}</p>
      </div>
    </article>
  )
}
