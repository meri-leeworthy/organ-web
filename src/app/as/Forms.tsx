"use client"

import { Button } from "@/components/styled/Button"
import {
  getRooms,
  register,
  joinRoomAction,
  getStateAction,
  setStateAction,
  getStateTypeAction,
  sendMessage,
  getAliases,
  getRoomIdFromAlias,
  setAlias,
  createRoom,
  createTagIndexSpace,
  unsetTagIndexSpace,
  createPostsBus,
} from "./actions"
import { seedTags } from "./seedTags"
import { seedIDPages } from "./seedIDPages"
import { seedEvents } from "./seedEvents"
import { seedPosts } from "./seedPosts"
import React, { Suspense, useState, useTransition } from "react"
import { getOrCreateMailboxId } from "@/lib/sendEmail"
import { getSecretFromRoom, storeSecretInRoom } from "@/lib/roomSecretStore"
import { Pre } from "@/components/styled/Pre"
import { Progress } from "@/components/ui/progress"

import { useFormState, useFormStatus } from "react-dom"

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
  const [rooms, setRooms] = useState<string[]>([])

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
        {rooms.map(roomId => {
          return (
            <li key={roomId} className="py-2">
              {roomId}
              {/* <ul className="">
                {room.map((r, i) => (
                  <li key={i} className="my-4">
                    <span>{r.name}</span>
                    <span className="ml-2 text-xs uppercase">{r.room_id}</span>
                    {/* {JSON.stringify(r)} *
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
              </ul> */}
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
      <Pre>{JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function Register() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        const user = formData.get("user") as string
        const result = await register(user)
        setResult(result)
      }}>
      <input
        type="text"
        name="user"
        placeholder="userid"
        className="border border-black"
      />
      <Button type="submit">register</Button>
      <Pre>{JSON.stringify(result, null, 3)}</Pre>
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
          formData.get("email") as string,
          formData.get("user") as string
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
      <Pre>{JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SetSecret() {
  const [result, setResult] = useState({})

  // secrets room (test? what is it for?)
  // "!NUVsYlMWcttFfEHkCj:radical.directory",

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await storeSecretInRoom(
          formData.get("room") as string,
          formData.get("key") as string,
          formData.get("value") as string
        )
        setResult(result)
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
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
      <Pre>{JSON.stringify(result, null, 3)}</Pre>
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
          formData.get("room") as string,
          formData.get("key") as string
        )
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <input
        type="text"
        name="key"
        placeholder="key"
        className="border border-black"
      />
      <Button type="submit">get secret</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function GetState() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await getStateAction(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <Button type="submit">get state</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function GetStateType() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await getStateTypeAction(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <input
        type="text"
        name="stateType"
        placeholder="stateType"
        className="border border-black"
      />
      <Button type="submit">get state</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SetState() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await setStateAction(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <input
        type="text"
        name="stateType"
        placeholder="stateType"
        className="border border-black"
      />
      <input
        type="text"
        name="stateKey"
        placeholder="stateKey"
        className="border border-black"
      />
      <input
        type="text"
        name="content"
        placeholder="content"
        className="border border-black"
      />
      <Button type="submit">set state</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SendMessage() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await sendMessage(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <input
        type="text"
        name="message"
        placeholder="content"
        className="border border-black"
      />
      <Button type="submit">send message</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function GetAliases() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await getAliases(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <Button type="submit">get aliases</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function GetRoomIdFromAlias() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await getRoomIdFromAlias(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="alias"
        placeholder="alias"
        className="border border-black"
      />
      <Button type="submit">get roomId from alias</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SetAlias() {
  const [result, setResult] = useState({})
  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await setAlias(formData)
        setResult({ result })
      }}>
      <input
        type="text"
        name="room"
        placeholder="roomId"
        className="border border-black"
      />
      <input
        type="text"
        name="alias"
        placeholder="alias"
        className="border border-black"
      />
      <Button type="submit">set alias</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function CreateRoom() {
  const [result, setResult] = useState({})
  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData", formData)
        const result = await createRoom(formData)
        if ("errcode" in result) {
          setResult({ result: result.errcode })
        } else {
          console.log("result", result)
          setResult({ roomId: result.roomId })
        }
      }}>
      <input
        type="text"
        name="name"
        placeholder="name"
        className="border border-black"
      />
      <label>
        Space?
        <input type="checkbox" name="space" value="false" />
      </label>

      <Button type="submit">create room</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function CreateTagIndexSpace() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async () => {
        const result = await createTagIndexSpace()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">create tag index space</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function RemoveTagIndexSpace() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async () => {
        const result = await unsetTagIndexSpace()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">remove tag index space</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SeedTags() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async () => {
        const result = await seedTags()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">seed tags</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SeedIds() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async (formData: FormData) => {
        const result = await seedIDPages()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">seed id pages</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SeedEvents() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async () => {
        const result = await seedEvents()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">seed event pages</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function SeedPosts() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async () => {
        const result = await seedPosts()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">seed posts</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

const initialState = {
  message: "",
}

export function SeedAll() {
  const [isPending, startTransition] = useTransition()

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const tempResult: any[] = []
    const registerResult = await register("bot")
    tempResult.push(registerResult)
    startTransition(() => {
      setResult(tempResult)
    })

    const tagIndexResult = await createTagIndexSpace()
    tempResult.push(tagIndexResult)
    startTransition(() => {
      setResult(tempResult)
    })

    const postsBusResult = await createPostsBus()
    tempResult.push(postsBusResult)
    startTransition(() => {
      setResult(tempResult)
    })

    const seedTagsResult = await seedTags()
    tempResult.push(seedTagsResult)
    startTransition(() => {
      setResult(tempResult)
    })

    const seedIdResult = await seedIDPages()
    tempResult.push(seedIdResult)
    startTransition(() => {
      setResult(tempResult)
    })

    const seedEventResult = await seedEvents()
    tempResult.push(seedEventResult)
    startTransition(() => {
      setResult(tempResult)
    })

    const seedPostResult = await seedPosts()
    tempResult.push(seedPostResult)
    startTransition(() => {
      setResult(tempResult)
    })
    console.log("tempResult", tempResult)
  }

  const [result, setResult] = useState<any[]>([])

  return (
    <form onSubmit={submitHandler}>
      <Button type="submit">seed all</Button>
      {isPending && <p>loading...</p>}
      <Progress
        value={Math.round(100 * (result.length / 7))}
        max={6}
        className="my-2"
      />
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}

export function CreatePostsBus() {
  const [result, setResult] = useState({})

  return (
    <form
      action={async () => {
        const result = await createPostsBus()
        console.log("result", result)
        setResult(result)
      }}>
      <Button type="submit">create posts bus</Button>
      <Pre> {JSON.stringify(result, null, 3)}</Pre>
    </form>
  )
}
