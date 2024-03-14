"use client"

import { isEvent } from "@/lib/isEvent"
import { useClient } from "@/hooks/useClient"
import { useEffect, useState } from "react"
import { Event, Room } from "simple-matrix-sdk"

const { NEXT_PUBLIC_SERVER_NAME: SERVER_NAME } = process.env

export default function RawOrgRoomEvents({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const [events, setEvents] = useState<Event[]>()
  const client = useClient()

  useEffect(() => {
    if (!client) return
    const room = new Room(`!${slug}:${SERVER_NAME}`, client)
    console.log("room", room)
    const iterator = room?.getMessagesAsyncGenerator("b", 200)

    iterator?.next().then(result => {
      const events = result.value.chunk //.filter(isEvent)
      setEvents(events)
      console.log("events", events)
    })
  }, [client])
  return (
    <ul className="max-w-xl">
      {events?.map((event, i) => (
        <li key={i} className="py-2 text-sm whitespace-pre-line break-words">
          {JSON.stringify(event)}
        </li>
      ))}
    </ul>
  )
}
