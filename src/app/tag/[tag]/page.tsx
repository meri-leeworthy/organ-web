import { getTagRoomId } from "@/app/tag/actions"
import { Item } from "./Item"
import { client } from "@/lib/client"

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params

  const tagRoomId = await getTagRoomId(tag)
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId)
    return JSON.stringify(tagRoomId)
  const tagRoom = client.getRoom(tagRoomId)
  const name = await tagRoom.getName()
  if ("errcode" in name) return JSON.stringify(name)

  const tagChildren = await tagRoom.getHierarchy({ max_depth: 1 })

  tagChildren?.shift()

  console.log("TagChldren", tagChildren)

  return (
    <div>
      <h1>{name.name}</h1>
      <ul>
        {tagChildren?.map((child: any) => {
          console.log("child", child)
          return <Item key={child.roomId} postRoomId={child.room_id} />
        })}
      </ul>
    </div>
  )
}
