"use client"

import Link from "next/link"
import { Dropdown, DropdownItem } from "."
import { useRoom } from "@/hooks/useRoom"

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
    room?.redactEvent(`$${event_id}`).then(result => {
      console.log("redaction result", result)
      location.reload()
    })
  }

  return (
    <Dropdown>
      <DropdownItem href={`/id/${slug}/${type}/${event_id}/edit`}>
        Edit Post
      </DropdownItem>
      <DropdownItem onClick={() => handlePostDelete(event_id)}>
        Delete Post
      </DropdownItem>
    </Dropdown>
  )
}
