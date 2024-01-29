import {
  ACCESSTOKEN_STORAGE_KEY,
  BASE_URL,
  USERID_STORAGE_KEY,
} from "@/lib/constants"
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

    const client = new Client(BASE_URL, accessToken, { userId, fetch })
    const room = new Room(`!${slug}:radical.directory`, client)
    setRoom(room)
  }, [slug, accessToken, userId])

  const memoizedRoom = useMemo(() => room, [room])

  return memoizedRoom
}
