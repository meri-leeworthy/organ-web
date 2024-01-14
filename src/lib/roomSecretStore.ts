"use server"

import { Client, Room } from "simple-matrix-sdk"
import { noCacheFetch } from "./utils"

const { MATRIX_BASE_URL, AS_TOKEN } = process.env

export async function storeSecretInRoom(
  roomId: string,
  key: string,
  value: string
) {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
    fetch,
  })

  const room = new Room(roomId, client)

  const eventId = await room.sendEvent("organ.secret", {
    body: value,
  })

  const stateEventId = await room.sendStateEvent("organ.secretId", eventId, key)

  console.log("stateEventId", stateEventId)

  return { stateEventId, eventId }
}

export async function getSecretFromRoom(roomId: string, key: string) {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
    fetch: noCacheFetch,
  })

  const room = new Room(roomId, client)

  const stateEventId = await room.getStateEvent("organ.secretId", key)

  console.log("eventId", stateEventId)

  const message = await room.getEvent(stateEventId.event_id)

  return message
}
