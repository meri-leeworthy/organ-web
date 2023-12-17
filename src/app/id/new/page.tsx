"use client"

import { useState } from "react"
import { useClient } from "@/lib/useClient"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"

const NewRoomPage = () => {
  const client = useClient()

  const [name, setName] = useState("")
  const [topic, setTopic] = useState("")
  const [avatar, setAvatar] = useState("")
  const [contacts, setContacts] = useState("")

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar(event.target.value)
  }

  const handleContactsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContacts(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Logic to create a new Matrix room with the provided inputs
    console.log("Creating new room...")
  }

  return (
    <div>
      <h1>New Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <Input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <label>
          Topic:
          <Input type="text" value={topic} onChange={handleTopicChange} />
        </label>
        <br />
        <label>
          Avatar:
          <Input type="text" value={avatar} onChange={handleAvatarChange} />
        </label>
        <br />
        <label>
          Contacts:
          <Input type="text" value={contacts} onChange={handleContactsChange} />
        </label>
        <br />
        <Button type="submit">Create Room</Button>
      </form>
    </div>
  )
}

export default NewRoomPage
