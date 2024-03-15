const { MATRIX_BASE_URL, AS_TOKEN, HOME_SPACE, SERVER_NAME } = process.env

// export const dynamic = "force-dynamic"

// TODO: why does the event show up on the org page but not the homepage?

import { Client, ClientEventOutput, Room, Timeline } from "simple-matrix-sdk"
import Link from "next/link"
import { Org } from "@/components/Org"
import { Suspense } from "react"
import { getIdLocalPart, noCacheFetch } from "@/lib/utils"
import { organCalEventUnstable, organPostUnstable } from "@/lib/types"
import { Posts } from "@/components/ui/Posts"
import { WelcomeEmailSignup } from "./WelcomeEmailSignup"

export default async function Home() {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
  })

  const noCacheClient = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
  })

  const space = new Room(HOME_SPACE!, client)
  const hierarchy = await space.getHierarchy()

  console.log("hierarchy", hierarchy)

  const children = hierarchy?.filter(room => room.children_state.length === 0)
  const rooms = children
    ?.filter(r => r !== undefined)
    .map(room => {
      if (!room) throw new Error("room is undefined")
      return new Room(room.room_id, noCacheClient)
    })

  await Promise.all(
    rooms
      ? rooms.map(async room => {
          try {
            await room.getName()
          } catch (e) {
            console.log(e)
          }
        })
      : []
  )

  // this needs to be replaced with a new way of getting posts - getHierarchy probably

  const posts: any[] = []
  // (
  //   await Promise.all(
  //     rooms.map(async room => {
  //       try {
  //         const messages = await room.getMessages({
  //           limit: 50,
  //           dir: "b",
  //         })
  //         if ("errcode" in messages) throw new Error(messages.errcode)
  //         return messages.chunk.filter(
  //           (message: any) =>
  //             message.type === "m.room.message" &&
  //             ((message.content?.msgtype === organCalEventUnstable &&
  //               new Date(message.content.start).valueOf() > Date.now()) ||
  //               message.content?.msgtype === organPostUnstable)
  //         )
  //       } catch (e) {
  //         console.log(e)
  //       }
  //     })
  //   )
  // )
  //   .flat()
  //   .filter(m => m !== undefined) as ClientEventOutput[]

  const timeline = new Timeline(posts)

  // console.log("posts", timeline)

  // const freshPosts = deleteOldEdits(posts)

  // get all tags
  // get all id pages for each tag
  // get all events for each tag
  // get all events for each id page
  // get all posts for each tag
  // get all posts for each id page
  // get all posts for each event

  return (
    <main className="flex w-full max-w-lg flex-col gap-4">
      <WelcomeEmailSignup />
      <h3 className="mt-2 text-lg font-medium">Recent posts</h3>
      <Posts posts={[...timeline.events.values()]} />
      <h3 className="mt-6 text-lg font-medium">Collectives</h3>
      <ul>
        {rooms?.map((room, i) => (
          <li key={i}>
            <Link href={`/id/${getIdLocalPart(room.roomId || "")}`}>
              <Suspense fallback={<>loading...</>}>
                <Org room={room} />
              </Suspense>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
