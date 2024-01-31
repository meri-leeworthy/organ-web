"use server"

import { organRoomUserNotifications } from "@/lib/types"
import { Client, Room } from "simple-matrix-sdk"

const { MATRIX_BASE_URL, AS_TOKEN } = process.env

export async function unsubscribeEmailFromRoom(roomId: string, hash: string) {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
  })
  const room = new Room(roomId, client)

  const powerLevels = await room.getPowerLevels()
  console.log("powerLevels", powerLevels)

  const res = await room.sendStateEvent(
    organRoomUserNotifications,
    {
      email: "never",
    },
    hash
  )
  console.log("state sent", res)

  return res
}
