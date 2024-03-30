"use client"

import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"
import { Client, Room } from "simple-matrix-sdk"
import { useEffect, useMemo, useState } from "react"

export function useRoom(slug: string) {
  const [room, setRoom] = useState<Room | null>(null)

  const accessToken =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
  const userId =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(USERID_STORAGE_KEY)

  useEffect(() => {
    if (!accessToken || !userId) return

    const client = new Client(
      process.env.NEXT_PUBLIC_MATRIX_BASE_URL!,
      accessToken,
      { userId, fetch }
    )
    const room = new Room(
      `!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`,
      client
    )
    setRoom(room)
  }, [slug, accessToken, userId])

  const memoizedRoom = useMemo(() => room, [room])

  return memoizedRoom
}
