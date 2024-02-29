"use server"

import { Client, Room } from "simple-matrix-sdk"
import { RoomDebug } from "./Forms"
import { joinRoom } from "../api/join/action"
import { noCacheFetch } from "@/lib/utils"
const { MATRIX_BASE_URL, AS_TOKEN } = process.env

const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch: noCacheFetch,
  params: { user_id: "@_relay_bot:radical.directory" }
})

export async function register(formData: FormData) {
  const user = formData.get("user") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch
  })
  const register = await client.post("register", {
    type: "m.login.application_service",
    username: `_relay_${user}`
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
    fetch: noCacheFetch,
    params: { user_id: `@_relay_${user}:radical.directory` }
  })
  const { joined_rooms: roomIds } = await client.get("joined_rooms", {
    user_id: `@_relay_${user}:radical.directory`
  })
  const rooms = roomIds.map((roomId: string) => {
    const room = new Room(roomId, client)
    return room
  })
  console.log("rooms", rooms, "user", user)
  const roomsWithData: RoomDebug[] = await Promise.all(
    rooms.map(async (room: Room) => {
      const roomData = await room.getHierarchy()
      // console.log("roomData", roomData)
      return roomData
    })
  )
  console.log("roomsWithData", roomsWithData)
  return roomsWithData
}

export async function getSpaceChildren(formData: FormData) {
  const space = formData.get("space") as string
  const children = await client.get(`rooms/${space}/children`)
  console.log("children", children)
  return children
}

export async function getStateAction(formData: FormData) {
  const roomId = formData.get("room") as string
  const room = new Room(roomId, client)
  const state = await room.getState()
  console.log("state", state)
  return state
}

export async function getStateTypeAction(formData: FormData) {
  const roomId = formData.get("room") as string
  const stateType = formData.get("stateType") as string
  console.log("stateType", stateType)
  const room = new Room(roomId, client)
  const state = await room.getStateEvent(stateType)
  console.log("state", state)
  return state
}

export async function setStateAction(formData: FormData) {
  const roomId = formData.get("room") as string
  const stateType = formData.get("stateType") as string
  const stateKey = formData.get("stateKey") as string
  const content = formData.get("content") as string
  const room = new Room(roomId, client)
  const state = await room.sendStateEvent(
    stateType,
    { type: content },
    stateKey
  )
  console.log("state", state)
  return state
}

export async function sendMessage(formData: FormData) {
  const roomId = formData.get("room") as string
  const message = formData.get("message") as string
  const room = new Room(roomId, client)
  return await room.sendMessage({ msgtype: "m.text", body: message })
}

export async function getAliases(formData: FormData) {
  const roomId = formData.get("room") as string
  const room = new Room(roomId, client)
  const aliases = await room.getAliases()
  console.log("aliases", aliases)
  return aliases
}

export async function getRoomIdFromAlias(formData: FormData) {
  const alias = formData.get("alias") as string
  console.log("alias", alias, encodeURIComponent(alias))
  const roomId = await client.getRoomIdFromAlias(alias)
  console.log("roomId", roomId)
  return roomId
}

export async function setAlias(formData: FormData) {
  const roomId = formData.get("room") as string
  const alias = formData.get("alias") as string
  return await client.put(`directory/room/${alias}`, { room_id: roomId })
}
