import {
  ACCESSTOKEN_STORAGE_KEY,
  BASE_URL,
  USERID_STORAGE_KEY,
} from "@/lib/constants"
import { useEffect, useMemo, useState } from "react"
import { Client } from "simple-matrix-sdk"

export function useClient() {
  const [client, setClient] = useState<Client | null>(null)

  const accessToken =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
  const userId =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(USERID_STORAGE_KEY)

  useEffect(() => {
    if (accessToken && userId) {
      const client = new Client(BASE_URL, accessToken, { userId, fetch })
      setClient(client)
    }
  }, [accessToken, userId])
  const memoizedClient = useMemo(() => client, [client])

  return memoizedClient
}
