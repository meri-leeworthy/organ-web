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

import { Posts } from "@/components/ui/Posts"
import { Suspense } from "react"
import { FollowButton } from "@/components/ui/FollowButton"
import { is, object, string } from "valibot"
import { EmailSubscribe } from "@/components/ui/EmailSubscribe"
import { IfRoomMember } from "@/components/IfRoomMember"
import { noCacheClient as client } from "@/lib/client"
import { Events } from "@/components/ui/Events"
import { AvatarFull } from "./AvatarFull"
import { getChild } from "@/lib/getChild"
import { Child } from "@/lib/getChild"

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
  // console.log("sc", spaceChildren?[0].children_state)

  spaceChildren?.shift()

  const postIds = spaceChildren?.map(child => child.room_id as string)

  const allChildren = (
    spaceChildren
      ? await Promise.all(
          spaceChildren.map(
            async child => await getChild(child.room_id, child.canonical_alias)
          )
        )
      : []
  ).filter(child => child !== null) as Child[]

  const posts = allChildren
    .filter(child => "roomType" in child && child["roomType"] === "post")
    .sort((a, b) => b?.postMeta?.timestamp! - a?.postMeta?.timestamp!)

  console.log("allChildren", allChildren)

  const imageUri = is(object({ url: string() }), avatar?.content)
    ? avatar.content.url
    : undefined
  const serverName = imageUri && imageUri.split("://")[1].split("/")[0]
  const mediaId = imageUri && imageUri.split("://")[1].split("/")[1]
  const avatarUrl =
    serverName && mediaId
      ? `${MATRIX_BASE_URL}/_matrix/media/r0/download/${serverName}/${mediaId}`
      : undefined
  // const contactKVs = await fetchContactKVs(room)

  // const members = await room.getMembers()
  // // console.log("members", members)

  // // note that email subscribers should be counted too
  // const memberCount = ("chunk" in members && members.chunk.length) || 0

  return (
    <>
      <div
        className={`flex w-4/5 py-6 -top-4 mb-4 z-10 sm:fixed ${
          avatarUrl ? "gap-4" : ""
        }`}>
        <Suspense fallback={<div>loading...</div>}>
          {avatarUrl && <AvatarFull url={avatarUrl} />}
        </Suspense>
        <h2 className="my-0 text-3xl font-bold lg:text-4xl ">{name}</h2>
      </div>

      <main className="flex flex-col sm:flex-row gap-4 lg:gap-6 sm:mt-14 z-0">
        <section className="my-2 mb-4 flex flex-col gap-4 shrink sm:fixed">
          {/* <IfRoomMember slug={getIdLocalPart(roomId)}>
            <div className="flex flex-wrap items-center gap-2">
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
            </div>
          </IfRoomMember> */}
          {/* <FollowButton slug={getIdLocalPart(roomId)} />
          <span className="text-xs uppercase opacity-60">
            <strong>{memberCount - 1}</strong> followers
          </span> */}

          <div className="flex w-full flex-col justify-start lg:flex-col-reverse lg:justify-end max-w-xs xl:max-w-sm">
            <p className="whitespace-pre-line text-sm lg:opacity-80 pr-4">
              {is(object({ topic: string() }), topic?.content) &&
                topic.content.topic}
            </p>
            {/* <Contact contactKVs={contactKVs} /> */}
          </div>

          {/* <Events postIds={postIds || []} /> */}
        </section>

        <section className="flex w-full flex-col gap-4 xl:gap-6 grow pt-1 sm:pl-80 lg:pl-96">
          {/* <EmailSubscribe slug={slug} dismissable /> */}

          <Suspense fallback={<div>loading...</div>}>
            <IfModerator slug={getIdLocalPart(roomId)}>
              <NewPost slug={getIdLocalPart(roomId)} />
            </IfModerator>
          </Suspense>

          <Posts posts={posts || []} />
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
