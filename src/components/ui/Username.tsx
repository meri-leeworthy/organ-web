"use client"

import { useClient } from "@/hooks/useClient"
import React, { useEffect, useState } from "react"

export const Username: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null)
  const client = useClient()

  useEffect(() => {
    if (!client) return
    client.getProfile(client.userId).then(profile => {
      setUsername(profile.displayname)
    })
  }, [client])

  return <div className="text-sm">{username}</div>
}
