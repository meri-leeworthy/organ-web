/* eslint-disable @next/next/no-img-element */
const { MATRIX_BASE_URL, AS_TOKEN } = process.env

// export const dynamic = "force-dynamic"

import { Room, Client, ClientEventOutput, Timeline } from "simple-matrix-sdk"
import { getMessagesChunk, noCacheFetch } from "@/lib/utils"
import { Contact } from "@/components/ui/Contact"
import { fetchContactKVs } from "@/lib/fetchContactKVs"
import { IconDotsVertical, IconSettings } from "@tabler/icons-react"
import Link from "next/link"
import { IfModerator } from "@/components/IfModerator"
import { Dropdown, DropdownItem, NewPost } from "@/components/ui"
import {
  OrganPostUnstableSchema,
  OrganCalEventUnstableSchema,
} from "@/lib/types"
import { Posts } from "@/components/ui/Posts"
import { Suspense } from "react"
import { FollowButton } from "@/components/ui/FollowButton"
import { is, object, string } from "valibot"
import { EmailSubscribe } from "@/components/ui/EmailSubscribe"
import { IfRoomMember } from "@/components/IfRoomMember"

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

  const nameResult = await room.getName()
  const name =
    typeof nameResult === "object" &&
    nameResult !== null &&
    "name" in nameResult &&
    typeof nameResult.name === "string" &&
    nameResult.name
  const messagesIterator = room.getMessagesAsyncGenerator()

  const messagesChunk: ClientEventOutput[] = []

  // await getMessagesChunk(
  //   messagesIterator
  // ).catch(() => console.error("error getting messages"))

  const messages = messagesChunk?.filter(
    message => message.type === "m.room.message"
  )

  const posts = messages?.filter(
    message =>
      is(OrganPostUnstableSchema, message.content) ||
      is(OrganCalEventUnstableSchema, message.content)
  )

  const timeline = posts && new Timeline(posts)

  const avatar = messagesChunk?.find(
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
  const topic = messagesChunk?.find(message => message.type === "m.room.topic")

  const members = await room.getMembers()
  // console.log("members", members)

  // note that email subscribers should be counted too
  const memberCount = ("chunk" in members && members.chunk.length) || 0

  return (
    <>
      <div className="my-6 mb-8 flex w-full flex-col gap-4 sm:flex-row-reverse">
        <div className="flex items-center justify-between gap-1 sm:ml-auto sm:flex-col-reverse sm:items-end">
          <span className="text-xs uppercase opacity-60">
            <strong>{memberCount - 1}</strong> followers
          </span>
          <div className="flex flex-row-reverse flex-wrap items-center gap-2">
            <IfRoomMember slug={slug}>
              <Dropdown>
                <DropdownItem href={`/id/${slug}/notifications`}>
                  Notification Settings
                </DropdownItem>
                <IfModerator slug={slug}>
                  <DropdownItem href={`/id/${slug}/edit`}>
                    Page Settings
                  </DropdownItem>
                </IfModerator>
              </Dropdown>
            </IfRoomMember>
            <FollowButton slug={slug} />
          </div>
        </div>
        <div className={`flex ${avatarUrl && "gap-4"}`}>
          <Suspense fallback={<div>loading...</div>}>
            {avatarUrl && <AvatarFull url={avatarUrl} />}
          </Suspense>
          <div className="flex items-end justify-between gap-2 sm:grow">
            <h2 className="flex w-72 gap-2 text-3xl font-bold lg:text-4xl">
              {name}
            </h2>
          </div>
        </div>
      </div>

      <main className="flex w-full flex-col gap-4 lg:flex-row-reverse xl:gap-6">
        <section className="flex w-full flex-col justify-start lg:w-48 lg:flex-col-reverse lg:justify-end xl:w-64">
          <p className="my-4 whitespace-pre-line text-sm italic lg:text-xs lg:opacity-80 xl:text-sm">
            {is(object({ topic: string() }), topic?.content) &&
              topic.content.topic}
          </p>
          <Contact contactKVs={contactKVs} />
        </section>

        <section className="flex w-full flex-col gap-4">
          <EmailSubscribe slug={slug} dismissable />

          <Suspense fallback={<div>loading...</div>}>
            <IfModerator slug={slug}>
              <NewPost slug={slug} />
            </IfModerator>
          </Suspense>

          <Posts posts={[...timeline?.events.values()]} />
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

  const messagesIterator = room.getMessagesAsyncGenerator()
  const messagesChunk: ClientEventOutput[] = await getMessagesChunk(
    messagesIterator
  ).catch(() => console.error("error getting messages"))
  const topic = messagesChunk?.find(message => message.type === "m.room.topic")

  return {
    title: room.name?.name,
    description:
      (is(object({ topic: string() }), topic?.content) &&
        topic.content.topic) ||
      "",
  }
}

function AvatarFull({ url }: { url: string | undefined }) {
  return (
    <div className="relative min-w-20">
      <div
        className={`absolute h-full w-full ${
          url ? "bg-transparent" : "bg-[#1D170C33]"
        }`}
      />
      {url && (
        <img src={url} alt="avatar" className="w-20 opacity-100 lg:w-40" />
      )}
    </div>
  )
}
