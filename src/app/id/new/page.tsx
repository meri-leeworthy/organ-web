"use client"

import { useState } from "react"
import { useClient } from "@/hooks/useClient"
import { Input, Button, Textarea } from "@/components/styled"
// import { EditableContacts } from "../[slug]/edit/EditableContactSection"
import {
  ContactType,
  contactTypes,
  organMetaContactUnstable,
  organRoomType,
} from "@/lib/types"
import { useRouter } from "next/navigation"
import { is } from "valibot"
import { ErrorSchema } from "simple-matrix-sdk"
import { ErrorBox } from "@/components/ui/ErrorBox"
import { slug } from "@/lib/utils"
import { IconNorthStar } from "@tabler/icons-react"
import { joinRoom } from "@/app/api/join/action"

const NewRoomPage = () => {
  const client = useClient()

  const router = useRouter()

  const [name, setName] = useState("")
  const [topic, setTopic] = useState("")
  const [contactKVs, setContactKVs] = useState<
    Record<string, string | undefined>
  >({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function setContactKV(contactType: ContactType, contactValue?: string) {
    // console.log("setting contact kv", contactType, contactValue)
    setContactKVs({ ...contactKVs, [contactType]: contactValue })
  }
  function removeContactKV(contactType: ContactType) {
    const { [contactType]: _, ...rest } = contactKVs
    setContactKVs(rest)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleTopicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTopic(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Logic to create a new Matrix room with the provided inputs
    console.log("Creating new room...")
    try {
      const room = await client?.createRoom({
        name,
        topic,
        initial_state: [
          {
            type: "m.room.power_levels",
            state_key: "",
            content: {
              users: { "@_relay_bot:radical.directory": 100 },
            },
          },
          {
            type: organRoomType,
            state_key: "id",
            content: {
              type: organRoomType,
              value: "id",
            },
          },
        ],
        invite: ["@_relay_bot:radical.directory"],
      })
      if (!room) throw new Error("Failed to create room")
      console.log("Created room", room)
      if (is(ErrorSchema, room)) throw new Error(room.error)

      const join = await joinRoom(room.roomId, "bot")
      console.log("join", join)

      const organRoomTypeStateResult = await room?.sendStateEvent(
        organRoomType,
        "id"
      )

      console.log("organRoomTypeStateResult", organRoomTypeStateResult)

      router.push(`/id/${slug(room?.roomId)}`)
    } catch (error) {
      console.error(error)
      const strErr =
        (typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string" &&
          error.message) ||
        ""
      setError(strErr)
      return
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="flex items-center gap-2 text-2xl font-medium">
        <IconNorthStar size={24} /> New Group
      </h2>
      <p>
        Create a public profile for organisations, collectives, or other groups.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label htmlFor="name">Name</label>
        <Input
          name="name"
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <br />
        <label htmlFor="description">About</label>
        <Textarea
          name="description"
          value={topic}
          onChange={handleTopicChange}
        />
        <br />

        <ErrorBox error={error} />

        {/* <br />
        <label>
          Contacts:{" "}
          <EditableContacts
            {...{ contactKVs, setContactKV, removeContactKV }}
          />
        </label> */}

        <br />
        <Button type="submit" className="self-start border border-black">
          Create Page
        </Button>
      </form>
    </div>
  )
}

export default NewRoomPage
