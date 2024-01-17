"use server"

import { Client, Room } from "simple-matrix-sdk"
import { RoomDebug } from "./Forms"
import { joinRoom } from "../api/join/action"
const { MATRIX_BASE_URL, AS_TOKEN } = process.env

export async function register(formData: FormData) {
  const user = formData.get("user") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, { fetch })

  const register = await client.post("register", {
    type: "m.login.application_service",
    username: `_relay_${user}`,
  })

  console.log(register)

  return register
}

export async function joinRoomAction(formData: FormData) {
  const room = formData.get("room") as string
  const user = (formData.get("user") as string) || "bot"

  return joinRoom(room, user)
}

export async function getRooms(formData: FormData): Promise<RoomDebug[]> {
  const user = formData.get("user") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: { user_id: `@_relay_${user}:radical.directory` },
  })

  const { joined_rooms: roomIds } = await client.get("joined_rooms", {
    user_id: `@_relay_${user}:radical.directory`,
  })

  const rooms = roomIds.map((roomId: string) => {
    const room = new Room(roomId, client)
    return room
  })

  console.log("rooms", rooms, "user", user)

  const roomsWithData: RoomDebug[] = await Promise.all(
    rooms.map(async (room: Room) => {
      const roomData = await room.getHierarchy()
      console.log("roomData", roomData)
      return roomData
    })
  )

  console.log("roomsWithData", roomsWithData)

  return roomsWithData
}

export async function getSpaceChildren(formData: FormData) {
  const space = formData.get("space") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, { fetch })

  const children = await client.get(`rooms/${space}/children`)

  console.log("children", children)

  return children
}
