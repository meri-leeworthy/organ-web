/* eslint-disable @next/next/no-img-element */
const { MATRIX_BASE_URL, AS_TOKEN } = process.env

// export const dynamic = "force-dynamic"

import { Room, Client, Event } from "simple-matrix-sdk"
import { getMessagesChunk, noCacheFetch } from "@/lib/utils"
import { Contact } from "./Contact"
import { fetchContactKVs } from "@/lib/fetchContactKVs"
import { IconSettings } from "@tabler/icons-react"
import Link from "next/link"
import { IfModerator } from "@/components/IfModerator"
import { NewPost } from "@/components/ui"
import { organPostUnstable } from "@/lib/types"
import { OrgPosts } from "./OrgPosts"
import { Suspense } from "react"
import { Button } from "@/components/styled"

function deleteEditedMessages(messages: Event[]) {
  const rootEvents = new Map<string, Event[]>()

  messages.forEach(message => {
    if (message?.content && "m.relates_to" in message.content) {
      const id = message.content["m.relates_to"].event_id
      const edits = rootEvents.get(id)
      rootEvents.set(id, [...(edits || []), message])
    }
  })

  // console.log("rootEvents", rootEvents)

  rootEvents.forEach((edits, id) => {
    const finalEdit = edits.reduce((acc, edit) => {
      if (edit.origin_server_ts > acc.origin_server_ts) {
        return edit
      }
      return acc
    })
    // console.log("finalEdit", finalEdit)
    rootEvents.set(id, [finalEdit])
  })

  return [...rootEvents.values()].flat()
}

export default async function OrgSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const roomId = `!${slug}:radical.directory`

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
  })

  const room = new Room(roomId, client)

  console.log(await room.getName())

  const messagesIterator = room.getMessagesAsyncGenerator()
  const messagesChunk: Event[] = await getMessagesChunk(messagesIterator)
  const messages = messagesChunk.filter(
    message => message.type === "m.room.message"
  )
  const messagesWithoutDeleted = deleteEditedMessages(messages)
  const posts = messagesWithoutDeleted.filter(
    message => message.content?.msgtype === organPostUnstable
  )
  const avatar = messagesChunk.find(
    (message: Event) => message.type === "m.room.avatar"
  )
  const imageUri: string | undefined = avatar?.content?.url
  const serverName = imageUri && imageUri.split("://")[1].split("/")[0]
  const mediaId = imageUri && imageUri.split("://")[1].split("/")[1]
  const avatarUrl =
    serverName && mediaId
      ? `https://matrix.radical.directory/_matrix/media/r0/download/${serverName}/${mediaId}`
      : undefined
  const contactKVs = await fetchContactKVs(room)
  const topic = messagesChunk.find(message => message.type === "m.room.topic")

  return (
    <>
      <div className={`flex my-6 mb-10 ${avatarUrl && "gap-4"}`}>
        <Suspense fallback={<div>loading...</div>}>
          <Avatar url={avatarUrl} />
        </Suspense>
        <div className="flex flex-col gap-2 grow justify-between">
          <div className="flex justify-self-start self-end gap-2 justify-between items-end ml-auto">
            <IfModerator slug={slug}>
              <Link href={`/id/${slug}/edit`}>
                <Button className="gap-1 flex text-xs opacity-60 items-center border-0">
                  Edit Page <IconSettings size={16} />
                </Button>
              </Link>
            </IfModerator>
          </div>
          <h2 className="font-bold w-72 text-3xl lg:text-4xl">
            {room.name?.name}
          </h2>
          <div />
        </div>
      </div>
      <main className="flex flex-col lg:flex-row-reverse gap-4">
        <section className="lg:w-48 w-full flex flex-col lg:flex-col-reverse justify-start lg:justify-end">
          <p className="py-3 lg:font-sans lg:opacity-80 whitespace-pre-line lg:text-xs">
            {topic?.content?.topic}
          </p>
          <Contact contactKVs={contactKVs} />
        </section>

        <section className="w-full">
          <Suspense fallback={<div>loading...</div>}>
            <IfModerator slug={slug}>
              <NewPost slug={slug} />
            </IfModerator>
          </Suspense>

          <OrgPosts posts={posts} slug={slug} />
        </section>
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const roomId = `!${slug}:radical.directory`

  const room = new Room(
    roomId,
    new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
      params: {
        user_id: "@_relay_bot:radical.directory",
      },
      fetch,
    })
  )
  console.log(await room.getName())
  const messagesIterator = await room.getMessagesAsyncGenerator()
  const messagesChunk: Event[] = await getMessagesChunk(messagesIterator)
  const topic = messagesChunk?.find(message => message.type === "m.room.topic")

  return {
    title: room.name?.name,
    description: topic?.content?.topic,
  }
}

function Avatar({ url }: { url: string | undefined }) {
  return (
    <div className="relative">
      <div
        className={`absolute w-full h-full ${
          url ? "bg-transparent" : "bg-[#1D170C33]"
        }`}
      />
      {url && (
        <img src={url} alt="avatar" className="w-20 lg:w-40 opacity-100" />
      )}
    </div>
  )
}
