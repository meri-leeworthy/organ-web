"use client"

import { Button } from "@/components/styled/Button"
import { getRooms, register, joinRoomAction } from "./actions"
import { useState } from "react"
import { getOrCreateMailboxId } from "@/lib/sendEmail"
import { getSecretFromRoom, storeSecretInRoom } from "@/lib/roomSecretStore"
import { Pre } from "@/components/styled/Pre"

export type RoomDebug = {
  room_id: string
  name: string
  topic?: string
  canonical_alias?: string
  num_joined_members: number
  join_rule?: string
  world_readable?: boolean
  guest_can_join?: boolean
  children_state?: any
}[]

export function GetRooms() {
  const [rooms, setRooms] = useState<RoomDebug[]>([])

  return (
    <form
      action={async (formData: FormData) => {
        const rooms = await getRooms(formData)
        console.log("rooms", rooms)
        setRooms(rooms)
      }}>
      <input
        type="text"
        name="user"
        placeholder="_relay_???"
        className="border border-black"
      />
      <Button type="submit">get rooms</Button>
      <p>Rooms: </p>
      <ul>
        {rooms.map(room => {
          return (
            <li key={room[0].room_id} className="py-2">
              <ul className="">
                {room.map((r, i) => (
                  <li key={i} className="my-4">
                    <span>{r.name}</span>
                    <span className="ml-2 text-xs uppercase">{r.room_id}</span>
                    {/* {JSON.stringify(r)} */}
                    <ul>
                      {r["children_state"]?.map((roomChild: any, i: number) => (
                        <li key={i}>
                          <span className="ml-4 text-xs uppercase">
                            {roomChild.state_key}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </form>
  )
}

export function JoinRoom() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        const result = await joinRoomAction(formData)
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

export function CreateMailbox() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await getOrCreateMailboxId(
          formData.get("user") as string,
          formData.get("email") as string
        )
        setResult(result)
      }}>
      <input
        type="text"
        name="user"
        placeholder="userid"
        className="border border-black"
      />
      <input
        type="email"
        name="email"
        placeholder="email"
        className="border border-black"
      />
      <Button type="submit">create mailbox</Button>
      <p>Result: {JSON.stringify(result)}</p>
    </form>
  )
}

export function SetSecret() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await storeSecretInRoom(
          "!NUVsYlMWcttFfEHkCj:radical.directory",
          formData.get("key") as string,
          formData.get("value") as string
        )
        setResult(result)
      }}>
      <input
        type="text"
        name="key"
        placeholder="key"
        className="border border-black"
      />
      <input
        type="text"
        name="value"
        placeholder="value"
        className="border border-black"
      />
      <Button type="submit">set secret</Button>
      <Pre>Result: {JSON.stringify(result)}</Pre>
    </form>
  )
}

export function GetSecret() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await getSecretFromRoom(
          "!NUVsYlMWcttFfEHkCj:radical.directory",
          formData.get("key") as string
        )
        setResult({ result })
      }}>
      <input
        type="text"
        name="key"
        placeholder="key"
        className="border border-black"
      />
      <Button type="submit">get secret</Button>
      <Pre> Result: {JSON.stringify(result)}</Pre>
    </form>
  )
}
