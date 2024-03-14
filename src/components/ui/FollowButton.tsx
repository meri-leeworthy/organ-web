"use client"

import { useClient } from "@/hooks/useClient"
import { IconCheck, IconPlus } from "@tabler/icons-react"
import { useEffect, useState } from "react"

const { NEXT_PUBLIC_SERVER_NAME: SERVER_NAME } = process.env

export function FollowButton({ slug }: { slug: string }) {
  const [isFollowing, setIsFollowing] = useState(false)

  const client = useClient()

  useEffect(() => {
    if (!client) return
    client
      .getJoinedRooms()
      .then(result => {
        console.log("joined rooms result", result)
        const isMember = result.joined_rooms.some(
          roomId => roomId === `!${slug}:${SERVER_NAME}`
        )
        setIsFollowing(isMember)
      })
      .catch(() => setIsFollowing(false))
  }, [client, slug])

  function handleJoinRoom() {
    console.log("joining room")
    if (!client) return
    client
      .joinRoom(`!${slug}:${SERVER_NAME}`)
      .then(() => {
        console.log("joined room")
        setIsFollowing(true)
      })
      .catch((err: any) => console.error("error joining room", err))
  }

  if (!client) return null

  return (
    <button
      onClick={handleJoinRoom}
      disabled={isFollowing}
      className="flex items-center justify-center px-1 text-sm font-medium text-white border border-transparent rounded bg-primarydark disabled:border-primarydark disabled:bg-white disabled:text-black disabled:opacity-60">
      <span className="mr-1 text-xs uppercase">
        {isFollowing ? "Following" : "Follow"}
      </span>
      {isFollowing ? <IconCheck size={16} /> : <IconPlus size={16} />}
    </button>
  )
}
