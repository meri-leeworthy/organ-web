"use client"

import { useClient } from "@/hooks/useClient"
import { useEffect, useState } from "react"
import { ClientEventOutput, Room } from "simple-matrix-sdk"

export default function RawOrgRoomEvents({
  params: { slug, id },
}: {
  params: { slug: string; id: string }
}) {
  const [event, setEvent] = useState<ClientEventOutput>()
  const [error, setError] = useState("")
  const client = useClient()
  const room = client
    ? new Room(`!${slug}:radical.directory`, client)
    : undefined
  useEffect(() => {
    room
      ?.getEvent(`$${id}`)
      .then(post => {
        if (!post) throw new Error("Post not found")
        setEvent(post)
      })
      .catch(e => {
        setError(e)
      })
  }, [client])
  if (error) return `error! ${error} :(`
  return (
    <p className="max-w-xl py-2 text-sm whitespace-pre-line">
      {JSON.stringify(event)}
    </p>
  )
}
