const { NODE_ENV } = process.env

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX } = process.env

import { noCacheFetch, props } from "@/lib/utils"
import Link from "next/link"
import {
  Client,
  ClientEventOutput,
  EventContentOutput,
  Room
} from "simple-matrix-sdk"
import { Item } from "./Item"

export default async function ListTags() {
  console.log("NODE_ENV", NODE_ENV)

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: { user_id: `@_relay_bot:radical.directory` }
  })

  const index = new Room(TAG_INDEX!, client)
  const state = await index.getState()
  if ("errcode" in state) return null
  const children = state.getAll("m.space.child")
  console.log("children", children)
  if (!children) return null

  if (NODE_ENV !== "development") return null

  return (
    <>
      List tags
      <ul>
        {[...children.entries()]
          .filter(
            (childTuple: [string, ClientEventOutput]) =>
              !!props(childTuple[1], "content", "via")
          )
          .map((childTuple: [string, ClientEventOutput]) => (
            <Item key={childTuple[0]} child={childTuple[1]} />
          ))}
      </ul>
      <Link href="/tag/new">New Tag</Link>
    </>
  )
}
