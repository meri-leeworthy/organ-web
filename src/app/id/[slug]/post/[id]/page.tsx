const { AS_TOKEN, MATRIX_BASE_URL } = process.env

// export const dynamic = "force-dynamic"

import { Client, Room } from "simple-matrix-sdk"
import Link from "next/link"
import { getContextualDate } from "@/lib/utils"
import { OrganPostUnstableSchema, organPostUnstable } from "@/lib/types"
import { is, safeParse } from "valibot"

export default async function PostPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const { slug, id } = params
  const roomId = `!${slug}:radical.directory`
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
    fetch,
  })

  const room = new Room(roomId, client)
  const name = await room.getName()
  const post = await room.getEvent(`$${id}`)

  // const relations = await room.getRelations(post.event_id, {})

  // console.log("relations", relations)

  console.log("room name", name)
  console.log("post page", post)

  // console.log(safeParse(OrganPostUnstableSchema, post.content))

  if (!is(OrganPostUnstableSchema, post.content)) return "Post not valid :("

  const nameString =
    typeof name === "object" &&
    name !== null &&
    "name" in name &&
    typeof name.name === "string"
      ? name.name
      : ""

  return (
    <div className="w-full">
      <Link
        href={`/id/${slug}`}
        className="bg-[#fff9] font-medium text-sm border border-primary rounded hover:bg-primary px-2 py-1">
        &larr; {nameString}
      </Link>
      <h1 className="py-4 font-bold">{post.content?.title}</h1>
      <span className="mt-8 text-sm opacity-60">
        {getContextualDate(post.origin_server_ts)}
      </span>
      <p className="py-2 whitespace-pre-line">{post.content?.body}</p>
    </div>
  )
}
