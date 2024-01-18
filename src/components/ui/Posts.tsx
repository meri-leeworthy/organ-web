import { organCalEventUnstable, organPostUnstable } from "@/lib/types"
import { Post } from "@/components/ui/Post"
import { EventPost } from "@/components/ui/EventPost"
import { slug } from "@/lib/utils"
import { Event } from "simple-matrix-sdk"

export function Posts({ posts }: { posts: Event[] }) {
  // console.log("posts", posts)

  const sortedPosts = posts.sort((a, b) => {
    return b.originServerTs - a.originServerTs
  })

  return (
    <section className="">
      {sortedPosts.map((post, i) => {
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
      })}
    </section>
  )
}
