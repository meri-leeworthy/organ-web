"use server"

import { getHmac32 } from "@/lib/getHmac"
import { sendEmailFromMailbox } from "@/lib/sendEmail"
import { organRoomUserNotifications } from "@/lib/types"
import { Client, Room } from "simple-matrix-sdk"

const { MATRIX_BASE_URL, AS_TOKEN } = process.env

export async function subscribeEmailToRoom(roomId: string, email: string) {
  const hash = getHmac32(email)

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:radical.directory",
    },
  })
  const room = new Room(roomId, client)

  const name = await room.getName()
  console.log("name", name)

  const pageSpecificWelcomeEmailContent = `
  Hi, confirming you just for signed up to get updates about ${name} on Organ!
`

  const res = await room.sendStateEvent(
    organRoomUserNotifications,
    {
      email: "every",
    },
    hash,
  )

  console.log("state sent", res)

  if ("errcode" in res) return res

  //send confirmation email to user

  const result = await sendEmailFromMailbox(
    `relay_${hash}`,
    email as string,
    `You just signed up for updates for ${name} on Organ!`,
    pageSpecificWelcomeEmailContent,
  )

  return result
}
