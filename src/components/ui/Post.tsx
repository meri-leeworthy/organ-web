const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

import { getContextualDate } from "@/lib/utils"
import Link from "next/link"
import { EditMenu } from "@/components/ui/EditMenu"
import { Avatar } from "@/components/ui/Avatar"
import { Client, Room } from "simple-matrix-sdk"
import { IfModerator } from "../IfModerator"
import { OrganPostMeta } from "@/types/post"

export async function Post({
  post,
  id,
}: {
  post: OrganPostMeta
  id: string // the room id of the post
}) {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
  })

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

  console.log(authorName)

  // get avatar
  // const room = new Room(`!${slug}:radical.directory`, client)
  // const avatarUrl = await room.getAvatarMxc()
  return (
    <article className="mb-6 flex flex-col items-start rounded-lg border bg-white p-3 drop-shadow-sm">
      <div className="flex w-full items-center gap-2">
        <Link className="flex items-center gap-2" href={`/id/${null}` || ""}>
          {post.author && (
            <>
              {/* <Avatar url={avatarUrl} name={post.author?.value} /> */}
              <h5 className="flex items-center gap-2 text-sm font-medium">
                {authorName}
              </h5>
            </>
          )}
          <time className="justify-self-start text-xs uppercase opacity-60">
            {getContextualDate(post.timestamp)}
          </time>
        </Link>
        <div className="ml-auto">
          <IfModerator slug={id}>
            <EditMenu slug={id} event_id={id} type="post" />
          </IfModerator>
        </div>
      </div>
      <div className="mt-2 flex flex-col justify-between gap-2">
        {post && "title" in post && post?.title && (
          <div className="flex items-center gap-2">
            <Link href={`/id/${id}/post/${id}`}>
              <h4 className="flex gap-2 text-lg font-bold">
                {post && "title" in post && post?.title}
              </h4>
            </Link>
          </div>
        )}
        <p className="whitespace-pre-line">
          {post?.body.slice(0, 400)}
          {post?.body.length > 400 && (
            <>
              ...{" "}
              <Link href={`/id/${null}/post/${id}`} className="text-[#aa8eff] ">
                more
              </Link>
            </>
          )}
        </p>
      </div>
    </article>
  )
}
