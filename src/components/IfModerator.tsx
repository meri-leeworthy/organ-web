"use client"

import { useRoom } from "@/lib/useRoom"
import { useState, useEffect } from "react"

export async function IfModerator({
  roomId,
  children,
}: {
  roomId: string
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)
  const room = useRoom(roomId)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (typeof window === "undefined") return
  const accessToken = localStorage?.getItem("accessToken")
  const userId = localStorage?.getItem("userId")

  const userIsModerator = await room?.isUserModerator()

  if (isClient && accessToken && userId && userIsModerator)
    return <>{children}</>
  return null
}
