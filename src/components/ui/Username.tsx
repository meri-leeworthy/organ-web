"use client"

import { useClient } from "@/hooks/useClient"
import React, { useEffect, useState } from "react"
import LoginLogout from "./LoginLogout"

export const Username: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null)
  const client = useClient()

  useEffect(() => {
    if (!client) return
    client.getProfile(client.userId).then(profile => {
      setUsername(profile.displayname)
    })
  }, [client])

  if (!username) return <LoginLogout />

  return <div className="text-sm">{username}</div>
}
