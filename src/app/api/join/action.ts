"use server"

import { client } from "@/lib/client"
import { ErrorSchema, is } from "simple-matrix-sdk"

const { SERVER_NAME } = process.env

export async function joinRoom(room: string, user: string) {
  const join = await client.joinRoom(room, {
    user_id: `@_relay_${user}:${SERVER_NAME}`,
  })

  return join
}
