"use client"

import { ErrorBox } from "@/components/ui/ErrorBox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormEvent, FormEventHandler, useState } from "react"

const initialState = {
  email: "",
  roomId: "",
}

export default function Unsubscribe({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const toString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value || ""

  const roomIdParam = "room" in searchParams ? toString(searchParams.room) : ""
  const emailParam = "email" in searchParams ? toString(searchParams.email) : ""

  const [unsubscribed, setUnsubscribed] = useState(false)
  const [email, setEmail] = useState(emailParam)
  const [roomId, setRoomId] = useState(roomIdParam)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function unsubscribeEmailFromRoomAction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(e)
    const res = await fetch("/api/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ roomId, email }),
    })
    const data = await res.json()
    console.log(data)
    if ("errcode" in data) {
      setError(data.error)
      return
    }
    setUnsubscribed(true)
  }

  return (
    <Card className="flex w-full max-w-md flex-col gap-4">
      <CardHeader>
        <h1>Unsubscribe</h1>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-2"
          onSubmit={unsubscribeEmailFromRoomAction}
        >
          {unsubscribed ? (
            <p>You have been unsubscribed from {roomId}</p>
          ) : (
            <>
              <Input
                name="email"
                required
                placeholder="your.email@address.com"
                aria-label="email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <Input
                name="room-id"
                required
                placeholder="room id"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                aria-label="Room Id"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                Unsubscribe
              </Button>
              {error && <ErrorBox error={error} />}
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
