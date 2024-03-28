const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

export const dynamic = "force-dynamic"

import { Room, Event } from "simple-matrix-sdk"
import Link from "next/link"
import { Suspense } from "react"
import { getMessagesChunk } from "@/lib/utils"
import { Posts } from "@/components/ui/Posts"
import { WelcomeEmailSignup } from "./WelcomeEmailSignup"
import { client, getTagIndex } from "@/lib/client"
import * as v from "valibot"
import { FlexGridList, FlexGridListItem } from "@/components/ui/FlexGridList"
import { IconTag } from "@tabler/icons-react"

export default async function Home() {
  const tagIndex = await getTagIndex(client)
  if (typeof tagIndex === "object" && "errcode" in tagIndex) return tagIndex
  const hierarchy = await tagIndex.getHierarchy({ max_depth: 1 })
  const children = hierarchy?.filter(
    room =>
      "canonical_alias" in room && room.canonical_alias.includes("#relay_tag_")
  )

  console.log("children", hierarchy)

  const sortedChildren = children?.sort((a, b) => {
    return b.children_state.length - a.children_state.length
  })

  // get all tags
  // get all id pages for each tag
  // get all events for each tag
  // get all events for each id page
  // get all posts for each tag
  // get all posts for each id page
  // get all posts for each event

  return (
    <main className="flex w-full flex-col gap-4">
      {/* <WelcomeEmailSignup /> */}
      <h3 className="mt-2 text-lg font-medium">Recent posts</h3>
      <Posts posts={[]} />
      <h3 className="mt-6 text-lg font-medium">Tags</h3>
      <FlexGridList>
        {sortedChildren?.map((child, i) => (
          <FlexGridListItem key={i}>
            <Link
              href={`/tag/${
                child.canonical_alias.split("#relay_tag_")[1].split(":")[0]
              }`}>
              <Suspense fallback={<>loading...</>}>
                <Tag
                  room={client.getRoom(child.room_id)}
                  name={child.name}
                  count={child.children_state.length}
                />
              </Suspense>
            </Link>
          </FlexGridListItem>
        ))}
      </FlexGridList>
    </main>
  )
}

export async function Tag({
  room,
  name,
  count,
}: {
  room: Room
  name?: string
  count: number
}) {
  const state = await room.getState()
  if ("errcode" in state) return
  const topic = state.get("m.room.topic")
  // console.log("topic", topic)
  return (
    <div className="py-2 my-2 border-[#1D170C33] rounded overflow-clip">
      <h2 className="text-base flex w-full items-center gap-1 font-bold">
        <IconTag size={16} />
        {name || room.name?.name}
        <span className="ml-auto font-normal text-xs mr-2 text-stone-500">
          {count}
        </span>
      </h2>
      <p className="text-sm italic text-stone-600 line-clamp-3">
        {v.is(v.object({ topic: v.string() }), topic?.content) &&
          topic.content.topic.slice(0, 300)}
      </p>
    </div>
  )
}
