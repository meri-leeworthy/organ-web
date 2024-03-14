"use server"

const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

import { Client } from "simple-matrix-sdk"

export async function joinRoom(room: string, user: string) {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, { fetch })

  const join = await client.post(
    `join/${room}`,
    {},
    {
      user_id: `@_relay_${user}:${SERVER_NAME}`,
    }
  )

  console.log("join", join)

  return join
}
