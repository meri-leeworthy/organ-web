/* eslint-disable @next/next/no-img-element */
const { MATRIX_BASE_URL, AS_TOKEN } = process.env

// export const dynamic = "force-dynamic"

import { Room, Client, ClientEventOutput, Timeline } from "simple-matrix-sdk"
import { getMessagesChunk, noCacheFetch } from "@/lib/utils"
import { Contact } from "@/components/ui/Contact"
import { fetchContactKVs } from "@/lib/fetchContactKVs"
import { IconSettings } from "@tabler/icons-react"
import Link from "next/link"
import { IfModerator } from "@/components/IfModerator"
import { NewPost } from "@/components/ui"
import {
  OrganPostUnstableSchema,
  OrganCalEventUnstableSchema,
} from "@/lib/types"
import { Posts } from "@/components/ui/Posts"
import { Suspense } from "react"
import { FollowButton } from "@/components/ui/FollowButton"
import { is, object, string } from "valibot"

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
  const messagesChunk: ClientEventOutput[] = await getMessagesChunk(
    messagesIterator
  )
  const messages = messagesChunk.filter(
    message => message.type === "m.room.message"
  )

  const posts = messages.filter(
    message =>
      is(OrganPostUnstableSchema, message.content) ||
      is(OrganCalEventUnstableSchema, message.content)
  )

  const timeline = new Timeline(posts)

  const avatar = messagesChunk.find(
    (message: ClientEventOutput) => message.type === "m.room.avatar"
  )
  const imageUri: string | undefined = is(
    object({ url: string() }),
    avatar?.content
  )
    ? avatar.content.url
    : undefined
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
      <div className="flex items-center justify-end w-full gap-2">
        <FollowButton slug={slug} />
        <IfModerator slug={slug}>
          <Link
            href={`/id/${slug}/edit`}
            aria-label="Edit Page"
            className="flex items-center p-1 text-xs border-0 rounded-full opacity-60 hover:bg-primary">
            <IconSettings size={16} />
          </Link>
        </IfModerator>
      </div>
      <div className={`flex my-6 w-full mb-10 ${avatarUrl && "gap-4"}`}>
        <Suspense fallback={<div>loading...</div>}>
          <AvatarFull url={avatarUrl} />
        </Suspense>
        <div className="flex flex-col justify-between gap-2 grow">
          <div className="flex items-end self-end justify-between gap-2 ml-auto justify-self-start"></div>
          <h2 className="flex gap-2 text-3xl font-bold w-72 lg:text-4xl">
            {room.name?.name}
          </h2>
        </div>
      </div>

      <main className="flex flex-col w-full gap-4 lg:flex-row-reverse">
        <section className="flex flex-col justify-start w-full lg:w-48 lg:flex-col-reverse lg:justify-end">
          <p className="py-3 text-sm italic whitespace-pre-line lg:opacity-80 lg:text-xs">
            {is(object({ topic: string() }), topic?.content) &&
              topic.content.topic}
          </p>
          <Contact contactKVs={contactKVs} />
        </section>

        <section className="w-full">
          <Suspense fallback={<div>loading...</div>}>
            <IfModerator slug={slug}>
              <NewPost slug={slug} />
            </IfModerator>
          </Suspense>

          <Posts posts={[...timeline.events.values()]} />
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
  const messagesChunk: ClientEventOutput[] = await getMessagesChunk(
    messagesIterator
  )
  const topic = messagesChunk?.find(message => message.type === "m.room.topic")

  return {
    title: room.name?.name,
    description:
      is(object({ topic: string() }), topic?.content) && topic.content.topic,
  }
}

function AvatarFull({ url }: { url: string | undefined }) {
  return (
    <div className="relative">
      <div
        className={`absolute w-full h-full ${
          url ? "bg-transparent" : "bg-[#1D170C33]"
        }`}
      />
      {url && (
        <img src={url} alt="avatar" className="w-20 opacity-100 lg:w-40" />
      )}
    </div>
  )
}
