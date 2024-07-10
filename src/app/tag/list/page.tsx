const { NODE_ENV } = process.env

import { props } from "@/lib/utils"
import Link from "next/link"
import { ClientEventOutput, isError } from "simple-matrix-sdk"
import { Item } from "./Item"
import { noCacheClient as client, getTagIndex } from "@/lib/client"

export default async function ListTags() {
  console.log("NODE_ENV", NODE_ENV)

  const index = await getTagIndex(client)
  if (isError(index)) return null
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
