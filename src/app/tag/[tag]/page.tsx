import { getTagRoomId } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { IconTag } from "@tabler/icons-react"
import { ChildrenCarousel } from "@/components/ui/ChildrenCarousel"
// import { FlexGridList } from "@/components/ui/FlexGridList"
// import { Item } from "@/components/ui/Item"
import { Posts } from "@/components/ui/Posts"
import { getOrganEntity } from "@/lib/getEntity"
import { OrganEntity, OrganEntityBase, OrganEntitySchema } from "@/types/schema"
import { ErrorSchema, is, isError } from "simple-matrix-sdk"

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params
  if (!tag) return null

  const tagRoomId = await getTagRoomId(tag)
  if (isError(tagRoomId)) return JSON.stringify(tagRoomId)

  const tagRoom = client.getRoom(tagRoomId)
  const name = await tagRoom.getName()
  if (isError(name)) return JSON.stringify(name)

  const tagChildren = await tagRoom.getHierarchy({ max_depth: 1 })
  if (isError(tagChildren)) return JSON.stringify(tagChildren)

  tagChildren.shift()

  console.log("tagChildren", tagChildren)

  const allChildren = (
    tagChildren
      ? await Promise.all(
          tagChildren.map(
            async child =>
              await getOrganEntity(child.room_id, child.canonical_alias)
          )
        )
      : []
  ).filter(entity => entity !== undefined) as OrganEntityBase[]

  const events = allChildren.filter(
    entity =>
      is(OrganEntitySchema("event"), entity) &&
      entity.meta &&
      parseInt(entity.meta.start) > Date.now()
  )

  const ids = allChildren.filter(
    entity => "pageType" in entity && entity["pageType"] === "id"
  )

  const posts = allChildren.filter(
    entity => "roomType" in entity && entity["roomType"] === "post"
  )

  console.log("posts", posts)

  return (
    <div className="z-10">
      <h1 className="inline-flex px-3 py-1 mb-4 rounded-full items-center gap-2 border border-green-400">
        <IconTag />
        {name.name}
      </h1>

      {events.length > 0 && (
        <>
          <h2 className="mt-6">Upcoming Events</h2>
          <ChildrenCarousel spaceChildren={events as OrganEntity<"event">[]} />
        </>
      )}

      {ids.length > 0 && (
        <>
          <h2>Groups</h2>
          <ChildrenCarousel
            spaceChildren={ids as OrganEntity<"page", "id">[]}
          />
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
