const { MATRIX_BASE_URL, AS_TOKEN, HOME_SPACE } = process.env

export const dynamic = "force-dynamic"

import {
  Client,
  ClientEventSchema,
  ContentUnionSchema,
  Event,
  Room,
  RoomMessageContentSchema,
  Timeline,
} from "simple-matrix-sdk"
import Link from "next/link"
import { Org } from "./id/[slug]/Org"
import { Suspense } from "react"
import { getIdLocalPart, noCacheFetch, slug } from "@/lib/utils"
import { organCalEventUnstable, organPostUnstable } from "@/lib/types"
import { Post } from "@/components/ui/Post"
import { deleteOldEdits } from "@/lib/deleteOldEdits"
import { array, intersect, is, object, parse, safeParse, string } from "valibot"
import { Posts } from "@/components/ui/Posts"

async function getSpaceChildIds() {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
  })

  const space = new Room(HOME_SPACE!, client)
  const state = await space.getState()
  const sortedState = Room.sortEvents(state)
  const filteredChildren = sortedState["m.space.child"].filter(event => {
    const result = safeParse(object({ via: string() }), event.content)
    console.log("filteredChildren", event, result)
    return is(object({ via: array(string()) }), event.content)
  })

  const spaceChildIds = filteredChildren.map(event => event.state_key)
  return spaceChildIds
}

export default async function Orgs() {
  const roomIds = await getSpaceChildIds()

  console.log("roomIds", roomIds)
  // const accessToken = await getServerAccessToken()
  const rooms = roomIds
    .filter(r => r !== undefined)
    .map(roomId => {
      if (!roomId) throw new Error("roomId is undefined")
      return new Room(
        roomId,
        new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
          fetch: noCacheFetch,
          params: {
            user_id: "@_relay_bot:radical.directory",
          },
        })
      )
    })
  await Promise.all(
    rooms.map(async room => {
      try {
        await room.getName()
      } catch (e) {
        console.log(e)
      }
    })
  )

  rooms.forEach(room => {
    console.log("room name", room.name)
  })

  const posts = (
    await Promise.all(
      rooms.map(async room => {
        try {
          return (
            await room.getMessages({
              limit: 50,
              dir: "b",
            })
          ).chunk.filter(
            (message: any) =>
              message.type === "m.room.message" &&
              (message.content?.msgtype === organCalEventUnstable ||
                message.content?.msgtype === organPostUnstable)
          )
        } catch (e) {
          console.log(e)
        }
      })
    )
  ).flat()

  const timeline = new Timeline(posts)

  console.log("posts", timeline)

  // const freshPosts = deleteOldEdits(posts)

  return (
    <main className="w-full max-w-lg">
      <span className="text-lg font-bold">Recent posts</span>
      <Posts posts={posts} />
      <ul>
        {rooms.map((org, i) => (
          <li key={i}>
            <Link href={`/id/${getIdLocalPart(roomIds[i] || "")}`}>
              <Suspense fallback={<>loading...</>}>
                <Org room={org} />
              </Suspense>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
