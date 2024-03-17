import { searchTags } from "@/app/tag/actions"
import { Item } from "./Item"

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { tag } = params

  const searchTagsResult = await searchTags(tag)
  if (!searchTagsResult) return "no result"
  if ("errcode" in searchTagsResult) {
    return <div>{searchTagsResult.errcode}</div>
  }

  return (
    <div>
      <h1>Pages & posts tagged with {tag}</h1>
      <ul>
        {[...searchTagsResult.keys()].map(key => (
          <Item key={key} postRoomId={key} />
        ))}
      </ul>
    </div>
  )
}
