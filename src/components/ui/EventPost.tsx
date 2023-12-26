import { getContextualDate } from "@/lib/utils"
import Link from "next/link"
import { PostEditMenu } from "@/components/ui/PostEditMenu"
import { IfLoggedIn } from "@/components/IfLoggedIn"
import { Avatar } from "@/components/ui/Avatar"
import { IconCalendarEvent, IconMapPin } from "@tabler/icons-react"

export function EventPost({
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
  console.log("name:", content.title, "id", id)
  if (!content) return null
  return (
    <article className="mt-6  pb-4 flex flex-col items-start">
      <div className="flex items-center gap-2 w-full">
        <Link
          className="flex items-end gap-2"
          href={`/id/${slug}/post/${id}` || ""}>
          {content?.host && (
            <>
              <Avatar
                url={content?.host?.avatar_url}
                name={content?.host?.name}
              />
              <h5 className="text-sm flex items-center font-medium gap-2">
                {content?.host?.name}
              </h5>
              <span className="text-sm">posted a new event</span>
            </>
          )}
          <time className="opacity-60 text-xs uppercase">
            {getContextualDate(timestamp)}
          </time>
        </Link>
        <div className="ml-auto">
          <IfLoggedIn>
            <PostEditMenu slug={slug} event_id={id} />
          </IfLoggedIn>
        </div>
      </div>
      <div className="flex flex-col p-2 mt-2 justify-between gap-2 mb-1 ml-2 border rounded-lg">
        {"title" in content && content.title && (
          <div className="flex items-center gap-2">
            <Link href={`/id/${slug}/post/${id}`}>
              <h4 className="text-lg font-bold flex gap-2 items-center">
                {"title" in content && content.title}
              </h4>
              <ul>
                <li className="flex gap-2 uppercase text-xs items-center">
                  <IconCalendarEvent size={12} />
                  {getContextualDate(new Date(content.start).valueOf())}
                </li>
                <li className="flex gap-2 uppercase text-xs items-center">
                  <IconMapPin size={12} />
                  {"location" in content && content.location}
                </li>
              </ul>
            </Link>
          </div>
        )}
        <p className="whitespace-pre-line">{content.body}</p>
      </div>
    </article>
  )
}
