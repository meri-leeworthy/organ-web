import { Client, Room } from "simple-matrix-sdk"
import { useEffect, useMemo, useState } from "react"
import {
  ACCESSTOKEN_STORAGE_KEY,
  BASE_URL,
  USERID_STORAGE_KEY,
} from "@/lib/constants"

export function useRoom(slug: string) {
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
    const userId = localStorage.getItem(USERID_STORAGE_KEY)

    if (accessToken && userId) {
      const client = new Client(BASE_URL, accessToken, { userId, fetch })
      const room = new Room(`!${slug}:radical.directory`, client)
      setRoom(room)
    }
  }, [slug])

  const memoizedRoom = useMemo(() => room, [room])

  return memoizedRoom
}
