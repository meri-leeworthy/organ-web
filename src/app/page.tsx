export const dynamic = "force-dynamic"

import { Room } from "simple-matrix-sdk"
import Link from "next/link"
import { Suspense } from "react"
import { Posts } from "@/components/ui/Posts"
import { WelcomeEmailSignup } from "./WelcomeEmailSignup"
import { client, getTagIndex } from "@/lib/client"
import * as v from "valibot"
import { FlexGridList, FlexGridListItem } from "@/components/ui/FlexGridList"
import { IconTag } from "@tabler/icons-react"
import { Tag } from "@/components/ui/Tag"

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
      <Posts postIds={[] as string[]} />
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
