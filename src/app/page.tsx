const { MATRIX_BASE_URL, AS_TOKEN, HOME_SPACE } = process.env

// export const dynamic = "force-dynamic"

import { Client, Room } from "simple-matrix-sdk"
// import Link from "next/link"
// import { Org } from "./id/[slug]/Org"
// import { Suspense } from "react"
import { noCacheFetch, slug } from "@/lib/utils"
import { organCalEventUnstable, organPostUnstable } from "@/lib/types"
import { Post } from "@/components/ui/Post"

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
  const filteredChildren = sortedState["m.space.child"].filter(
    event => event.content && "content" in event && "via" in event.content
  )
  const spaceChildIds = filteredChildren.map(event => event.state_key)
  return spaceChildIds
}

export default async function Orgs() {
  const roomIds = await getSpaceChildIds()
  // const accessToken = await getServerAccessToken()
  const rooms = roomIds.map(
    roomId =>
      new Room(
        roomId,
        new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
          fetch: noCacheFetch,
          params: {
            user_id: "@_relay_bot:radical.directory",
          },
        })
      )
  )
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
            await room.getMessagesOneShotParams({
              limit: 50,
              dir: "b",
            })
          ).chunk
            .filter(
              (message: any) =>
                message.type === "m.room.message" &&
                (message.content?.msgtype === organCalEventUnstable ||
                  message.content?.msgtype === organPostUnstable)
            )
            .map(
              (message: any) => [message, slug(room.roomId)] as [any, string]
            )
        } catch (e) {
          console.log(e)
        }
      })
    )
  ).flat()

  // const asyncComponent: JSX.Element = await (async (org: Room) => await Org({ room: org }))

  return (
    <main className="max-w-lg w-full">
      <span className="text-lg font-bold">Recent posts</span>
      <ul>
        {posts.map(([post, slug], i) => {
          const { content, origin_server_ts, event_id } = post
          switch (post.content.msgtype) {
            case organPostUnstable:
              return (
                <Post
                  key={i}
                  content={content}
                  timestamp={origin_server_ts}
                  id={event_id.split("$")[1]}
                  slug={slug}
                />
              )
          }
        })}
      </ul>
      {/* <ul>
        {rooms.map((org, i) => (
          <li key={i}>
            <Link href={`/id/${getIdLocalPart(roomIds[i])}`}>
              <Suspense fallback={<>loading...</>}>
                <Org room={org} />
              </Suspense>
            </Link>
          </li>
        ))}
      </ul> */}
    </main>
  )
}
