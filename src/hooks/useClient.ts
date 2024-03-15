import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"
import { Client } from "simple-matrix-sdk"
import { useEffect, useMemo, useState } from "react"

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
      const client = new Client(
        process.env.NEXT_PUBLIC_MATRIX_BASE_URL!,
        accessToken,
        { userId, fetch }
      )
      setClient(client)
    }
  }, [accessToken, userId])
  const memoizedClient = useMemo(() => client, [client])

  return memoizedClient
}
