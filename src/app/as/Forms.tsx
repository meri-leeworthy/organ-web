"use client"

import { Button } from "@/components/Button"
import { getRooms, joinRoom, register } from "./actions"
import { useState } from "react"

export function GetRooms() {
  const [rooms, setRooms] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        const rooms = await getRooms(formData)
        setRooms(rooms)
      }}>
      <input
        type="text"
        name="user"
        placeholder="userid"
        className="border border-black"
      />
      <Button type="submit">get rooms</Button>
      <p>Rooms: {JSON.stringify(rooms)}</p>
    </form>
  )
}

export function JoinRoom() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        const result = await joinRoom(formData)
        setResult(result)
      }}>
      <input
        type="text"
        name="room"
        placeholder="room"
        className="border border-black"
      />
      <Button type="submit">join</Button>
      <p>Result: {JSON.stringify(result)}</p>
    </form>
  )
}

export function Register() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        const result = await register(formData)
        setResult(result)
      }}>
      <input
        type="text"
        name="user"
        placeholder="userid"
        className="border border-black"
      />
      <Button type="submit">register</Button>
      <p>Result: {JSON.stringify(result)}</p>
    </form>
  )
}
