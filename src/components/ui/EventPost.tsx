/* eslint-disable @next/next/no-img-element */
const { MATRIX_BASE_URL, AS_TOKEN } = process.env

import { getContextualDate, getMxcUrl } from "@/lib/utils"
import Link from "next/link"
import { EditMenu } from "@/components/ui/EditMenu"
import { IfLoggedIn } from "@/components/IfLoggedIn"
import { Avatar } from "@/components/ui/Avatar"
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react"
import { Client, Room } from "simple-matrix-sdk"
import { IfModerator } from "../IfModerator"

export async function EventPost({
  content,
  timestamp,
  id,
  slug,
}: {
  content: any
  timestamp: number
  id: string
  slug: string
}) {
  // console.log("event content", content)
  // console.log("name:", content.title, "id", id)
  if (!content) return null

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
  })
  const room = new Room(`!${slug}:radical.directory`, client)
  const avatarUrl = await room.getAvatarMxc()

  return (
    <article className="flex flex-col items-start pb-4">
      <div className="flex items-center w-full gap-2">
        <Avatar url={avatarUrl} name={content?.host?.name} />
        <Link
          className="flex flex-wrap items-baseline gap-x-1"
          href={`/id/${slug}` || ""}>
          {content?.host && (
            <>
              <h5 className="flex gap-2 text-sm font-medium">
                {content?.host?.name}
              </h5>
              <span className="mr-1 text-sm">posted a new event</span>
            </>
          )}
          <time className="text-xs uppercase opacity-60">
            {getContextualDate(timestamp)}{" "}
          </time>
        </Link>
        <div className="z-10 ml-auto">
          <IfModerator slug={slug}>
            <EditMenu slug={slug} event_id={id} type="event" />
          </IfModerator>
        </div>
      </div>
      <div className="flex flex-col justify-between w-full gap-2 mt-2 mb-1 overflow-hidden bg-white border rounded-lg drop-shadow-sm">
        {content.avatar && (
          <div className="flex items-center justify-center grow">
            <img
              src={content.avatar}
              alt="post"
              key={content.avatar}
              className="w-full"
            />
          </div>
        )}
        <div className="flex items-center gap-2 p-2">
          <Link href={`/id/${slug}/event/${id}`}>
            <h3 className="flex items-center gap-2 mb-1 text-2xl font-bold">
              {"title" in content && content.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              <li className="flex items-center gap-2 px-1 text-sm uppercase bg-orange-100 rounded">
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
          </Link>
        </div>

        <p className="p-2 whitespace-pre-line">
          {content.body.slice(0, 400)}
          {content.body.length > 400 && (
            <>
              ...{" "}
              <Link
                href={`/id/${slug}/event/${id}`}
                className="text-[#aa8eff] ">
                more
              </Link>
            </>
          )}
        </p>
      </div>
    </article>
  )
}
