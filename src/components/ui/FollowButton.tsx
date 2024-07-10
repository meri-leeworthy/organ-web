"use client"

import { useClient } from "@/hooks/useClient"
import { IconCheck, IconPlus, IconReload } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Button } from "./button"
import { isError } from "simple-matrix-sdk"

export function FollowButton({ slug }: { slug: string }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const client = useClient()

  useEffect(() => {
    if (!client) return
    client
      .getJoinedRooms()
      .then(result => {
        if (isError(result)) return console.error("error getting rooms")
        console.log("joined rooms result", result)
        const isMember = result.joined_rooms.some(
          roomId => roomId === `!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`
        )
        setIsFollowing(isMember)
      })
      .catch(() => setIsFollowing(false))
  }, [client, slug])

  function handleJoinRoom() {
    console.log("joining room")
    setIsLoading(true)
    if (!client) return
    client
      .joinRoom(`!${slug}:${process.env.NEXT_PUBLIC_SERVER_NAME}`)
      .then(res => {
        console.log("joined room")
        if ("errcode" in res) {
          setIsLoading(false)
          return console.error("error joining room", res)
        }
        setIsFollowing(true)
        setIsLoading(false)
      })
  }

  if (!client) return null

  return (
    <Button
      onClick={handleJoinRoom}
      disabled={isFollowing || isLoading}
      className="px-2 py-1 bg-primary text-black hover:text-primary">
      {isLoading ? (
        <IconReload size={16} className="mr-2 animate-spin" />
      ) : isFollowing ? (
        <IconCheck size={16} className="mr-2" />
      ) : (
        <IconPlus size={16} className="mr-2" />
      )}
      <span className="mr-1 text-xs uppercase">
        {isLoading ? "Loading" : isFollowing ? "Following" : "Follow"}
      </span>
    </Button>
  )
}
