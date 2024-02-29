import { Client } from "simple-matrix-sdk"
import { noCacheFetch } from "./utils"

const { MATRIX_BASE_URL, AS_TOKEN } = process.env

export const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch,
  params: { user_id: "@_relay_bot:radical.directory" }
})

export const noCacheClient = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch: noCacheFetch,
  params: { user_id: "@_relay_bot:radical.directory" }
})
