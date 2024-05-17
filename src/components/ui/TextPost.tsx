import {
  getContextualDate,
  getIdLocalPart,
  normaliseTagString,
} from "@/lib/utils"
import { OrganEntity } from "@/types/schema"
import { client } from "@/lib/client"
import { PostMenu } from "@/components/ui/PostMenu"
import { Avatar } from "@/components/ui/Avatar"
import Link from "next/link"

export async function TextPost({ post }: { post: OrganEntity }) {
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
    <div className="max-w-md">
      {post.postMeta!.title && (
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
      {/* <Form postId={post.roomId} /> */}
    </div>
  )
}
