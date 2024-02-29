"use client"

import { removeTag } from "@/app/tag/actions"
import { props, str } from "@/lib/utils"
import Link from "next/link"
import { ClientEventOutput } from "simple-matrix-sdk"

export function Item({ child }: { child: ClientEventOutput }) {
  async function removeTagHandler(child: ClientEventOutput) {
    console.log("child", child)
    const remove = await removeTag(child.event_id)
    console.log("remove", remove)
  }

  const tag = str(props(child, "content", "order"))

  return (
    <li className="mb-1 flex w-52 justify-between rounded bg-gray-200 p-1 px-2">
      <Link href={`/tag/${tag}`}>{tag}</Link>
      <button className="font-bold" onClick={() => removeTagHandler(child)}>
        X
      </button>
    </li>
  )
}
