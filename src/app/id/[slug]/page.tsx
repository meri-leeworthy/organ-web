/* eslint-disable @next/next/no-img-element */
const { MATRIX_BASE_URL, SERVER_NAME } = process.env

export const dynamic = "force-dynamic"

import { Room, Client, ClientEventOutput, Timeline } from "simple-matrix-sdk"
import { getIdLocalPart, getMessagesChunk, noCacheFetch } from "@/lib/utils"
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
import { client } from "@/lib/client"

export default async function OrgSlugPage({
  params,
}: {
  params: { slug: string }
}) {
  // slug should be scoped alias substring
  const { slug } = params

  // get room id from slug
  const roomId = await client.getRoomIdFromAlias(
    `#relay_id_${slug}:${SERVER_NAME}`
  )
  if (typeof roomId === "object" && "errcode" in roomId)
    return JSON.stringify(roomId)
  const room = client.getRoom(roomId)

  const nameResult = await room.getName()
  const name =
    typeof nameResult === "object" &&
    nameResult !== null &&
    "name" in nameResult &&
    typeof nameResult.name === "string" &&
    nameResult.name

  const state = await room.getState()
  if ("errcode" in state) return JSON.stringify(state)

  const avatar = state.get("m.room.avatar")
  const topic = state.get("m.room.topic")

  const spaceChildren = await room.getHierarchy({ max_depth: 1 })
  console.log("spaceChildren", spaceChildren)

  spaceChildren?.shift()

  const imageUri = is(object({ url: string() }), avatar?.content)
    ? avatar.content.url
    : undefined
  const serverName = imageUri && imageUri.split("://")[1].split("/")[0]
  const mediaId = imageUri && imageUri.split("://")[1].split("/")[1]
  const avatarUrl =
    serverName && mediaId
      ? `${MATRIX_BASE_URL}/_matrix/media/r0/download/${serverName}/${mediaId}`
      : undefined
  const contactKVs = await fetchContactKVs(room)

  const members = await room.getMembers()
  // console.log("members", members)

  // note that email subscribers should be counted too
  const memberCount = ("chunk" in members && members.chunk.length) || 0

  return (
    <>
      <div className="my-2 mb-8 flex w-full flex-col gap-4 sm:flex-row-revers max-w-xl">
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
        <div className="flex items-center justify-between gap-1 ">
          <span className="text-xs uppercase opacity-60">
            <strong>{memberCount - 1}</strong> followers
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IfRoomMember slug={getIdLocalPart(roomId)}>
            <Dropdown>
              <DropdownItem href={`/id/${slug}/notifications`}>
                Notification Settings
              </DropdownItem>
              <IfModerator slug={getIdLocalPart(roomId)}>
                <DropdownItem href={`/id/${slug}/edit`}>
                  Page Settings
                </DropdownItem>
              </IfModerator>
            </Dropdown>
          </IfRoomMember>
          <FollowButton slug={getIdLocalPart(roomId)} />
        </div>
      </div>

      <main className="flex w-full flex-col gap-4 lg:flex-row-reverse xl:gap-6 ">
        <section className="flex w-full flex-col justify-start lg:w-48 lg:flex-col-reverse lg:justify-end xl:w-64">
          <p className="my-4 whitespace-pre-line text-sm italic lg:text-xs lg:opacity-80 xl:text-sm">
            {is(object({ topic: string() }), topic?.content) &&
              topic.content.topic}
          </p>
          <Contact contactKVs={contactKVs} />
        </section>

        <section className="flex w-full flex-col gap-4">
          {/* <EmailSubscribe slug={slug} dismissable /> */}

          <Suspense fallback={<div>loading...</div>}>
            <IfModerator slug={getIdLocalPart(roomId)}>
              <NewPost slug={getIdLocalPart(roomId)} />
            </IfModerator>
          </Suspense>

          <Posts
            postIds={spaceChildren?.map(child => child.room_id as string) || []}
          />
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
  const roomId = `!${slug}:${SERVER_NAME}`

  // const room = new Room(
  //   roomId,
  //   new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  //     params: {
  //       user_id: "@_relay_bot:" + SERVER_NAME,
  //     },
  //     fetch,
  //   })
  // )

  // const messagesIterator = room.getMessagesAsyncGenerator()
  // const messagesChunk: ClientEventOutput[] = await getMessagesChunk(
  //   messagesIterator
  // ).catch(() => console.error("error getting messages"))
  // const topic = messagesChunk?.find(message => message.type === "m.room.topic")

  // return {
  //   title: room.name?.name,
  //   description:
  //     (is(object({ topic: string() }), topic?.content) &&
  //       topic.content.topic) ||
  //     "",
  // }
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
