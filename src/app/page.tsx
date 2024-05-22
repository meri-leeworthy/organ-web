export const dynamic = "force-dynamic"

import Link from "next/link"
import { Suspense } from "react"
import { Posts } from "@/components/ui/Posts"
import { WelcomeEmailSignup } from "./WelcomeEmailSignup"
import { client, getTagIndex } from "@/lib/client"
import { FlexGridList, FlexGridListItem } from "@/components/ui/FlexGridList"
import { Tag } from "@/components/ui/Tag"
import { OrganEntity } from "@/types/schema"
import { getEventsMap, getIdsMap } from "./as/getMaps"
import { getChild } from "../lib/getChild"
import { props } from "@/lib/utils"
import { ChildrenCarousel } from "@/components/ui/ChildrenCarousel"
import { OrganPostMetaSchema } from "@/types/post"

const { SERVER_NAME } = process.env

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

  const tags = (
    await Promise.all(
      sortedChildren!.map(async child => await getChild(child.room_id))
    )
  ).filter(Boolean) as OrganEntity[]

  const postsBusId = await client.getRoomIdFromAlias(
    "#relay_bus_posts:" + SERVER_NAME
  )
  if (typeof postsBusId === "object" && "errcode" in postsBusId)
    return postsBusId
  const postsBus = client.getRoom(postsBusId)

  const postBusEvents = await postsBus.getMessages({ limit: 30, dir: "b" })
  if ("errcode" in postBusEvents) return postBusEvents
  const postIdsAndAliases = postBusEvents.chunk
    .map(event => props(event, "content", "id"))
    .filter(Boolean)

  const posts = (
    await Promise.all(
      postIdsAndAliases.map(async id => await getChild(id as string))
    )
  )
    .filter(post => {
      console.log(OrganPostMetaSchema.safeParse(post))
      console.log("post", post)
      return true
    })
    .sort((a, b) => b?.postMeta?.timestamp! - a?.postMeta?.timestamp!)

  // console.log("posts", posts)
  // const idsMap = await getIdsMap()
  // const eventsMap = await getEventsMap()
  // if ("errcode" in idsMap) return idsMap
  // if ("errcode" in eventsMap) return eventsMap

  // const postIds = new Set<string>()

  // idsMap.forEach((id, _alias) => {
  //   console.log("id", id)
  //   client
  //     .getRoom(id)
  //     .getHierarchy({ max_depth: 1 })
  //     .then(hierarchy => {
  //       // console.log("hierarchy", hierarchy)
  //       hierarchy?.forEach(child => {
  //         console.log("child roomid", child.room_id)
  //         postIds.add(child.room_id)
  //       })
  //     })
  //     .then(() => {
  //       console.log("postIds", postIds)
  //     })
  // })

  // console.log("postIds", postIds)
  // getChild

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
      <h1 className="font-black mb-2 z-10 self-start">organ</h1>
      <ChildrenCarousel spaceChildren={tags} />
      <h3 className="text-xl font-bold">recent..</h3>
      <Posts posts={posts as OrganEntity[]} />
      {/* <FlexGridList>
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
      </FlexGridList> */}
    </main>
  )
}
