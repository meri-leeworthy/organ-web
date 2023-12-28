"use client"

import Link from "next/link"
import { Dropdown } from "."
import { useRoom } from "@/lib/useRoom"

export function EditMenu({
  slug,
  event_id,
  type,
}: {
  slug: string
  event_id: string
  type: "post" | "event"
}) {
  const room = useRoom(slug)

  function handlePostDelete(event_id: string) {
    room?.redactEvent(event_id).then(() => {
      location.reload()
    })
  }

  return (
    <Dropdown>
      <Link href={`/id/${slug}/${type}/${event_id}/edit`} className="right-0">
        Edit Post
      </Link>
      <button onClick={() => handlePostDelete(event_id)}>Delete Post</button>
    </Dropdown>
  )
}
