const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

// export const dynamic = "force-dynamic"

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
  const hierarchy = await tagIndex.getHierarchy()
  const children = hierarchy?.filter(room => room.children_state.length === 0)

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
        {children?.map((child, i) => (
          <FlexGridListItem key={i}>
            <Link
              href={`/tag/${
                child.canonical_alias.split("#relay_tag_")[1].split(":")[0]
              }`}>
              <Suspense fallback={<>loading...</>}>
                <Tag room={client.getRoom(child.room_id)} name={child.name} />
              </Suspense>
            </Link>
          </FlexGridListItem>
        ))}
      </FlexGridList>
    </main>
  )
}

export async function Tag({ room, name }: { room: Room; name?: string }) {
  const messagesIterator = await room.getMessagesAsyncGenerator()
  const messagesChunk: Event[] = await getMessagesChunk(messagesIterator)
  // const messageTypes = messagesChunk.map(message => message.type)
  const topic = messagesChunk.find(message => message.type === "m.room.topic")
  // console.log("topic", topic)
  return (
    <div className="py-2 my-2 border-[#1D170C33] rounded overflow-clip">
      <h2 className="text-base flex items-center gap-1 font-bold">
        <IconTag size={16} />
        {name || room.name?.name}
      </h2>
      <p className="text-sm italic text-stone-600 line-clamp-3">
        {v.is(v.object({ topic: v.string() }), topic?.content) &&
          topic.content.topic.slice(0, 300)}
      </p>
    </div>
  )
}
