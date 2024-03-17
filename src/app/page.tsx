const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

export const dynamic = "force-dynamic"

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
    fetch: noCacheFetch,
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
  })

  const tagIndexRoomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )

  if (typeof tagIndexRoomId === "object" && "errcode" in tagIndexRoomId)
    return tagIndexRoomId.errcode

  const tagIndex = client.getRoom(tagIndexRoomId)

  const hierarchy = await tagIndex.getHierarchy()

  console.log("hierarchy", hierarchy)

  // space children are showing up in state events but not in the hierarchy :/

  const children = hierarchy?.filter(room => room.children_state.length === 0)
  const rooms = children
    ?.filter(r => r !== undefined)
    .map(room => {
      if (!room) throw new Error("room is undefined")
      return new Room(room.room_id, client)
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
      <Posts posts={[]} />
      <h3 className="mt-6 text-lg font-medium">Collectives</h3>
      <ul>
        {rooms?.map((room, i) => (
          <li key={i}>
            <Link href={`/tag/${getIdLocalPart(room.roomId || "")}`}>
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
