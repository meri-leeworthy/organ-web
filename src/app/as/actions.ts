"use server"

import { Client, CreateRoomOpts, Room } from "simple-matrix-sdk"
import { RoomDebug } from "./Forms"
import { joinRoom } from "../api/join/action"
import { noCacheFetch } from "@/lib/utils"
import { organSpaceType, organSpaceTypeValue } from "@/types/schema"
import { noCacheClient as client } from "@/lib/client"

const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

export async function register(user: string) {
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

export async function createRoom(formData: FormData) {
  const name = formData.get("name") as string
  const space = formData.get("space") as string

  console.log("space", space)

  const opts: CreateRoomOpts = {
    name,
  }

  if (space === "true") {
    opts["creation_content"] = { type: "m.space" }
  }
  const room = await client.createRoom(opts)
  console.log("room", room)
  if ("errcode" in room) return room
  return { roomId: room.roomId }
}

export async function getRooms(formData: FormData): Promise<RoomDebug[]> {
  const user = formData.get("user") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: { user_id: `@_relay_${user}:${SERVER_NAME}` },
  })
  const { joined_rooms: roomIds } = await client.get("joined_rooms", {
    user_id: `@_relay_${user}:${SERVER_NAME}`,
  })

  console.log("roomIds", roomIds)

  const rooms = roomIds?.map((roomId: string) => {
    const room = new Room(roomId, client)
    return room
  })
  console.log("rooms", rooms, "user", user)
  const roomsWithData: RoomDebug[] = await Promise.all(
    rooms?.map(async (room: Room) => {
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
  if ("errcode" in state) return JSON.stringify(state)
  const arrayState = Array.from(state.map.entries())
  console.log("array state", arrayState)
  const fullyDecodedState = arrayState.map(([key, value]) => {
    return [key, Array.from(value.entries())]
  })
  return { result: fullyDecodedState }
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
  const room = client.getRoom(roomId)
  const aliases = await room.getAliases()
  console.log("aliases", aliases)
  return aliases
}

export async function getRoomIdFromAlias(formData: FormData) {
  const alias = formData.get("alias") as string
  const roomId = await client.getRoomIdFromAlias(alias)
  console.log("roomId", roomId)
  return roomId
}

export async function setAlias(formData: FormData) {
  const roomId = formData.get("room") as string
  const alias = formData.get("alias") as string
  return await client.getRoom(roomId).setAlias(alias)
}

export async function createTagIndexSpace() {
  const space = await client.createRoom({
    name: "Tag Index",
    creation_content: { type: "m.space" },
    room_alias_name: "relay_tagindex",
    initial_state: [
      {
        type: organSpaceType,
        content: {
          value: organSpaceTypeValue.index,
        },
      },
    ],
  })
  console.log("space", space)
  if ("errcode" in space) {
    const roomId = await client.getRoomIdFromAlias(
      "#relay_tagindex:" + SERVER_NAME
    )
    console.log("roomId", roomId)
    return { message: "Tag Index already created", roomId }
  }
  return { message: "Tag Index created", roomId: space.roomId }
}

export async function unsetTagIndexSpace() {
  const roomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )
  console.log("roomId", roomId)
  if (typeof roomId === "object" && "errcode" in roomId) return roomId
  return await client
    .getRoom(roomId)
    .deleteAlias("#relay_tagindex:" + SERVER_NAME)
}
