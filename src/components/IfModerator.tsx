"use client"

import { useRoom } from "@/hooks/useRoom"
import { useState, useEffect } from "react"

export function IfModerator({
  slug,
  children,
  fallback,
}: {
  slug: string
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [isModerator, setIsModerator] = useState(false)
  const room = useRoom(slug)

  console.log("room", room, "slug", slug, "isModerator", isModerator)

  useEffect(() => {
    if (!room) return
    room
      .isUserModerator()
      .then(result => {
        console.log("result", result)
        setIsModerator(result)
      })
      .catch(() => setIsModerator(false))
  }, [room])

  if (typeof window === "undefined") return fallback ? <>{fallback}</> : null
  const accessToken = localStorage?.getItem("accessToken")
  const userId = localStorage?.getItem("userId")

  if (isModerator && accessToken && userId) return <>{children}</>
  return fallback ? <>{fallback}</> : null
}
