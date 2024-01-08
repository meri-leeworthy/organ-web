import { organCalEventUnstable, organPostUnstable } from "@/lib/types"
import { Post } from "@/components/ui/Post"
import { EventPost } from "@/components/ui/EventPost"
import { slug } from "@/lib/utils"

export function Posts({ posts }: { posts: any[] }) {
  // console.log("posts", posts)
  return (
    <section className="">
      {posts.map((post, i) => {
        const { content, origin_server_ts, event_id } = post

        const postSlug = slug(post.room_id)

        switch (content?.msgtype) {
          case organPostUnstable:
            return (
              <Post
                key={i}
                content={content}
                timestamp={origin_server_ts}
                id={event_id.split("$")[1]}
                slug={postSlug}
              />
            )
          case organCalEventUnstable:
            return (
              <EventPost
                key={i}
                content={content}
                timestamp={origin_server_ts}
                id={event_id.split("$")[1]}
                slug={postSlug}
              />
            )
        }
      })}
    </section>
  )
}
