const { MATRIX_BASE_URL, AS_TOKEN } = process.env
import { getSecretFromRoom } from "@/lib/roomSecretStore"
import {
  OrganCalEventUnstable,
  OrganPostUnstable,
  organRoomSecretEmail,
  organRoomUserNotifications,
} from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"
import { Client, Room } from "simple-matrix-sdk"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    roomId,
    post,
  }: { roomId: string; post: OrganPostUnstable | OrganCalEventUnstable } = body

  // this endpoint probably should be authenticated - only admins should be able to call it

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
  })
  const room = new Room(roomId, client)

  const state = await room.getState()
  console.log("state", state)

  // get all the state events with organ.room.user.notifications

  const hashes = state
    .filter((event: any) => {
      return event.type === organRoomUserNotifications
    })
    .map((event: any) => {
      return event.state_key
    })

  console.log("hashes", hashes)

  hashes.forEach(async (hash: string) => {
    const roomId = await client.getRoomIdFromAlias(
      `%23relay_${hash}%3Aradical.directory`
    )
    console.log("roomId", roomId)
    const email = await getSecretFromRoom(roomId, organRoomSecretEmail)
    console.log("email", email)
    const room = new Room(roomId, client)
  })

  return NextResponse.json({
    now: Date.now(),
    message: "Subscribed!",
  })
}
