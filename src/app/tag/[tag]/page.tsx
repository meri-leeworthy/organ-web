import { getTagRoomId } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { IconTag } from "@tabler/icons-react"
import { ChildrenCarousel } from "@/components/ui/ChildrenCarousel"
// import { FlexGridList } from "@/components/ui/FlexGridList"
// import { Item } from "@/components/ui/Item"
import { Posts } from "@/components/ui/Posts"
import { Child, getChild } from "@/lib/getChild"

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params
  if (!tag) return null

  const tagRoomId = await getTagRoomId(tag)
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId)
    return JSON.stringify(tagRoomId)

  console.log("tagRoomId", tagRoomId)

  const tagRoom = client.getRoom(tagRoomId)
  const name = await tagRoom.getName()
  if ("errcode" in name) return JSON.stringify(name)

  const tagChildren = await tagRoom.getHierarchy({ max_depth: 1 })

  tagChildren?.shift()

  console.log("tagChildren", tagChildren)

  const allChildren = (
    tagChildren
      ? await Promise.all(
          tagChildren.map(
            async child => await getChild(child.room_id, child.canonical_alias)
          )
        )
      : []
  ).filter(Boolean) as Child[]

  const events = allChildren.filter(
    child =>
      "pageType" in child &&
      child["pageType"] === "event" &&
      parseInt(child["eventMeta"]!.start) > Date.now()
  )

  const ids = allChildren.filter(
    child => "pageType" in child && child["pageType"] === "id"
  )

  const posts = allChildren.filter(
    child => "roomType" in child && child["roomType"] === "post"
  )

  console.log("posts", posts)

  return (
    <div>
      <h1 className="inline-flex px-3 py-1 rounded-full items-center gap-2 border border-green-400">
        <IconTag />
        {name.name}
      </h1>

      {events && (
        <>
          <h2 className="mt-6">Upcoming Events</h2>
          <ChildrenCarousel spaceChildren={events as Child[]} />
        </>
      )}

      {ids && (
        <>
          <h2>Groups</h2>
          <ChildrenCarousel spaceChildren={ids as Child[]} />
        </>
      )}

      {posts.length > 0 && (
        <>
          <h2>Posts</h2>
          <Posts posts={posts || []} />
        </>
      )}
    </div>
  )
}
