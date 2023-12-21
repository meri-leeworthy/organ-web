import { getContextualDate } from "@/lib/utils"
import Link from "next/link"
import { PostEditMenu } from "@/components/ui/PostEditMenu"
import { IfLoggedIn } from "@/components/IfLoggedIn"
import { Avatar } from "@/components/ui/Avatar"

export function OrgPosts({ slug, posts }: { slug: string; posts: any[] }) {
  return (
    <section className="">
      {posts.map((post, i) => {
        const { content, origin_server_ts, event_id } = post
        console.log("post", post)
        return (
          <Post
            key={i}
            content={content}
            timestamp={origin_server_ts}
            id={event_id}
            slug={slug}
          />
        )
      })}
    </section>
  )
}

function Post({
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
  return (
    <article className="mt-6  pb-4 flex flex-col items-start">
      <div className="flex items-center gap-2 w-full">
        {content?.author && (
          <>
            <Avatar
              url={content?.author?.avatar_url}
              name={content?.author?.name}
            />
            <h5 className="text-sm flex items-center font-medium gap-2">
              <Link
                href={
                  `/orgs/${content.author.id.split("!")[1].split(":")[0]}` || ""
                }>
                {content?.author?.name}
              </Link>
            </h5>
          </>
        )}
        <time className="opacity-60 text-xs justify-self-start uppercase">
          {getContextualDate(timestamp)}
        </time>
        <div className="ml-auto">
          <IfLoggedIn>
            <PostEditMenu slug={slug} event_id={id} />
          </IfLoggedIn>
        </div>
      </div>
      <div className="flex flex-col mt-2 justify-between gap-2 mb-1 ml-2 border rounded-lg">
        {content && "title" in content && content?.title && (
          <div className="flex items-center gap-2">
            <Link href={`/id/${slug}/post/${id.split("$")[1]}`}>
              <h4 className="text-lg font-bold">
                {content && "title" in content && content?.title}
              </h4>
            </Link>
          </div>
        )}
        <p className="whitespace-pre-line p-2">{content?.body}</p>
      </div>
    </article>
  )
}
