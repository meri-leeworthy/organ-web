const { AS_TOKEN, MATRIX_BASE_URL, SERVER_NAME } = process.env

// export const dynamic = "force-dynamic"

import { Client, Room, is } from "simple-matrix-sdk"
import Link from "next/link"
import { getContextualDate } from "@/lib/utils"
import { IfLoggedIn } from "@/components/IfLoggedIn"
import { EditMenu } from "@/components/ui"
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react"
import { OrganCalEventMetaSchema } from "@/types/event"

export default async function EventPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  //TODO: this is a copy of PostPage needs changing (and refactor to share code?)

  const { slug, id } = params
  const roomId = `!${slug}:${SERVER_NAME}`
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
    fetch,
  })

  const room = new Room(roomId, client)
  const name = await room.getName()
  const post = await room.getEvent(`$${id}`)
  // const avatarUrl = await room.getAvatarMxc()

  if ("errcode" in post || !is(OrganCalEventMetaSchema, post.content))
    return "Event not valid :("

  const { content } = post

  // const title = content?.title || ""
  // const body = content?.body || ""
  // const host = content?.host || {}

  // console.log("room name", name)
  // console.log("post page", post)

  // if (post.content?.msgtype !== organCalEventUnstable)
  return "Post not valid :("

  // const nameString =
  //   typeof name === "object" &&
  //   name !== null &&
  //   "name" in name &&
  //   typeof name.name === "string"
  //     ? name.name
  //     : ""

  //   return (
  //     // <div className="w-full">
  //     //   <EventPost
  //     //     content={post.content}
  //     //     timestamp={post.origin_server_ts}
  //     //     id={id}
  //     //     slug={slug}
  //     //   />
  //     //   <h1 className="py-4">{post.content?.title}</h1>
  //     //   <span className="mt-8 text-sm opacity-60">
  //     //     {getContextualDate(post.origin_server_ts)}
  //     //   </span>
  //     //   <p className="py-2 whitespace-pre-line">{post.content?.body}</p>
  //     // </div>
  //     <div className="flex flex-col items-start pb-4 mt-6">
  //       <Link
  //         href={`/id/${slug}`}
  //         className="bg-[#fff9] uppercase text-sm border rounded hover:border-primary px-2 py-1">
  //         &larr; {"nameString"}
  //       </Link>
  //       {/* <div className="flex items-center w-full gap-2">
  //         <Avatar url={avatarUrl?.url} name={post.content?.host?.name} />

  //         {content?.host && (
  //           <>
  //             <h5 className="flex gap-2 text-sm font-medium">
  //               {content?.host?.name}
  //             </h5>
  //             <span className="mr-1 text-sm">posted a new event</span>
  //           </>
  //         )}
  //         <time className="text-xs uppercase opacity-60">
  //           {getContextualDate(timestamp)}{" "}
  //         </time>
  //       </div> */}
  //       <article className="flex flex-col justify-between w-full gap-2 p-4 mt-2 mb-1 bg-white rounded-lg drop-shadow-sm">
  //         {content.avatar && (
  //           <div className="flex items-center justify-center grow">
  //             <img
  //               src={content.avatar}
  //               alt="post"
  //               key={content.avatar}
  //               className="w-full max-w-lg"
  //             />
  //           </div>
  //         )}
  //         <div className="flex flex-col gap-2">
  //           <div className="flex w-full">
  //             <h3 className="flex items-center gap-2 mb-1 text-2xl font-bold">
  //               {"title" in content && content.title}
  //             </h3>
  //             <div className="ml-auto">
  //               <IfLoggedIn>
  //                 <EditMenu slug={slug} event_id={id} type="event" />
  //               </IfLoggedIn>
  //             </div>
  //           </div>
  //           <ul className="flex flex-wrap gap-2">
  //             <li className="flex items-center gap-2 px-1 text-sm uppercase bg-orange-100 rounded">
  //               <IconMapPin size={12} />
  //               {"location" in content && content.location}
  //             </li>
  //             <li
  //               className={`flex gap-2 uppercase text-sm px-1 rounded items-center ${
  //                 new Date(content.start).valueOf() > Date.now()
  //                   ? "bg-primary"
  //                   : "bg-slate-200"
  //               }`}>
  //               <IconCalendarEvent size={12} />
  //               {getContextualDate(new Date(content.start).valueOf())}
  //               {/* {new Intl.DateTimeFormat("en-AU").format(new Date(timestamp))} */}
  //             </li>
  //           </ul>
  //         </div>

  //         <p className="whitespace-pre-line">{content.body}</p>
  //       </article>
  //     </div>
  //   )
}
