"use client"

import { useState } from "react"
import { useClient } from "@/hooks/useClient"
import { Input, Button, Textarea } from "@/components/styled"
// import { EditableContacts } from "../[slug]/edit/EditableContactSection"
import {
  ContactType,
  contactTypes,
  organMetaContactUnstable,
} from "@/lib/types"

const NewRoomPage = () => {
  const client = useClient()

  const [name, setName] = useState("")
  const [topic, setTopic] = useState("")
  const [contactKVs, setContactKVs] = useState<
    Record<string, string | undefined>
  >({})

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Logic to create a new Matrix room with the provided inputs
    console.log("Creating new room...")
    client?.createRoom({
      name,
      topic,
      initial_state: [
        {
          type: organMetaContactUnstable,
          state_key: contactTypes.email,
          content: {
            type: contactTypes.email,
            value: contactKVs[contactTypes.email],
          },
        },
      ],
    })
  }

  return (
    <div className="w-full max-w-md">
      <h2>New Group Profile</h2>
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
