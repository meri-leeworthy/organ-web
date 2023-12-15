"use server"

import { Client } from "simple-matrix-sdk"
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

export async function joinRoom(formData: FormData) {
  const room = formData.get("room") as string
  const user = (formData.get("user") as string) || "bot"

  console.log("formData", formData, "room", room, "user", user)

  for (const value of formData.values()) {
    console.log("value", value)
  }

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, { fetch })

  const join = await client.post(
    `join/${room}`,
    {},
    {
      user_id: `@_relay_${user}:radical.directory`,
    }
  )

  console.log("join", join)

  return join
}

export async function getRooms(formData: FormData) {
  const user = formData.get("user") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, { fetch })

  const rooms = await client.get("joined_rooms", {
    user_id: `@_relay_${user}:radical.directory`,
  })

  console.log("rooms", rooms)

  return rooms
}
