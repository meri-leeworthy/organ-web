"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useClient } from "@/hooks/useClient"

const Redirect = ({
  roomId,
  children,
}: {
  roomId: string
  children: JSX.Element
}) => {
  const client = useClient()
  useEffect(() => {
    if (!client) return
    client.getJoinedRooms().then(rooms => {
      if (!rooms.joined_rooms.includes(roomId)) redirect("/")
    })
  }, [client, roomId])

  return children
}

export default Redirect
