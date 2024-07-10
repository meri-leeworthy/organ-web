"use client"

import { useClient } from "@/hooks/useClient"
import { useState } from "react"
import { isError } from "simple-matrix-sdk"

export default function Following() {
  const client = useClient()
  const [rooms, setRooms] = useState<string[]>([])
  client?.getJoinedRooms().then(rooms => {
    if (isError(rooms)) return
    setRooms(rooms.joined_rooms)
  })

  return (
    <div>
      <h1>Following</h1>
      {rooms.map(room => (
        <p key={room}>{room}</p>
      ))}
    </div>
  )
}
