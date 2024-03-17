import { Client } from "simple-matrix-sdk"
import { noCacheFetch } from "./utils"

const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

export const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch,
  params: { user_id: "@_relay_bot:" + SERVER_NAME },
})

export const noCacheClient = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch: noCacheFetch,
  params: { user_id: "@_relay_bot:" + SERVER_NAME },
})

export async function getTagIndex(client: Client) {
  const tagIndexRoomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )

  if (typeof tagIndexRoomId === "object" && "errcode" in tagIndexRoomId)
    return tagIndexRoomId

  return client.getRoom(tagIndexRoomId)
}
