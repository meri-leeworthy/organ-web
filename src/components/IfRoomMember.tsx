"use client"

import { useClient } from "@/hooks/useClient"
import { xor } from "@/lib/utils"
import { useState, useEffect } from "react"

export function IfRoomMember({
  slug,
  children,
  not = false,
}: {
  slug: string
  children: React.ReactNode
  not?: boolean
}) {
  const [isMember, setIsMember] = useState(not)
  const client = useClient()

  useEffect(() => {
    if (!client) return
    client
      .getJoinedRooms()
      .then(result => {
        // console.log("joined rooms result", result)
        const isMember = result.joined_rooms.some(
          roomId => roomId === `!${slug}:radical.directory`
        )
        setIsMember(isMember)
      })
      .catch(() => setIsMember(false))
  }, [client, slug])

  if (typeof window === "undefined") return
  const accessToken = localStorage?.getItem("accessToken")
  const userId = localStorage?.getItem("userId")

  if (xor(isMember, not) && accessToken && userId) return <>{children}</>
  return null
}
