import { getTagRoomId } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { IconTag } from "@tabler/icons-react"
import { FlexGridList } from "@/components/ui/FlexGridList"
import { Item } from "@/components/ui/Item"

// TODO: show posts

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params

  const tagRoomId = await getTagRoomId(tag)
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId)
    return JSON.stringify(tagRoomId)

  console.log("tagRoomId", tagRoomId)

  const tagRoom = client.getRoom(tagRoomId)
  const name = await tagRoom.getName()
  if ("errcode" in name) return JSON.stringify(name)

  const tagChildren = await tagRoom.getHierarchy({ max_depth: 1 })

  tagChildren?.shift()

  console.log("TagChldren", tagChildren)

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <IconTag />
        {name.name}
      </h1>
      <FlexGridList>
        {tagChildren?.map((child: any) => {
          console.log("child", child)
          return <Item key={child.roomId} postRoomId={child.room_id} />
        })}
      </FlexGridList>
    </div>
  )
}
