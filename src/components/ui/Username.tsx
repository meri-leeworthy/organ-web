"use client"

import { useClient } from "@/hooks/useClient"
import React, { useState } from "react"

export const Username: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null)
  const client = useClient()

  if (client) {
    client.getProfile(client.userId).then(profile => {
      // console.log(profile)
      setUsername(profile.displayname)
    })
  }

  return <div className="text-sm">{username}</div>
}
