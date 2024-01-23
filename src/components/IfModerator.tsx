"use client"

import { useRoom } from "@/hooks/useRoom"
import { useState, useEffect } from "react"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"

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
  const accessToken = localStorage?.getItem(ACCESSTOKEN_STORAGE_KEY)
  const userId = localStorage?.getItem(USERID_STORAGE_KEY)

  if (isModerator && accessToken && userId) return <>{children}</>
  return fallback ? <>{fallback}</> : null
}
