"use client"

import { useRoom } from "@/hooks/useRoom"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function IfModerator({
  slug,
  children,
  fallback,
  redirect,
}: {
  slug: string
  children: React.ReactNode
  fallback?: React.ReactNode
  redirect?: string
}) {
  const [isModerator, setIsModerator] = useState(false)
  const room = useRoom(slug)
  const router = useRouter()

  // console.log("room", room, "slug", slug, "isModerator", isModerator)

  useEffect(() => {
    if (!room) return
    console.log("checking if moderator")
    room.isUserModerator().then(result => {
      console.log("result", result)
      setIsModerator(result)
      if (!result && redirect) router.push(redirect)
    })
  }, [room, router, redirect])

  if (isModerator) return <>{children}</>
  return fallback ? <>{fallback}</> : null
}
