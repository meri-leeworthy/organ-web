"use server"

import { getHmac32 } from "@/lib/getHmac"
import { sendEmailFromMailbox } from "@/lib/sendEmail"
import { organRoomUserNotifications } from "@/types/schema"
import { Client, Room } from "simple-matrix-sdk"

const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

export async function unsubscribeEmailFromRoom(roomId: string, email: string) {
  const hash = getHmac32(email)

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
  })
  const room = new Room(roomId, client)

  const name = await room.getName()
  if (typeof name === "object" && name !== null && "errcode" in name)
    return name
  console.log("name", name)

  const nameString =
    typeof name === "object" && name !== null && "name" in name
      ? name.name
      : "unnamed room"

  const unsubscribedEmailContent = `
    Hi, just an email to confirm that you have unsubscribed from updates for ${nameString}
    on Organ. If you're having any issues or feedback about Organ, please email
    radical.directory@protonmail.com
  `

  const res = await room.sendStateEvent(
    organRoomUserNotifications,
    {
      email: "never",
    },
    hash
  )
  console.log("state sent", res)

  if ("errcode" in res) return res

  //send confirmation email to user

  const result = await sendEmailFromMailbox(
    `relay_${hash}`,
    email as string,
    `You just unsubscribed from updates for ${nameString} on Organ!`,
    unsubscribedEmailContent,
    unsubscribedEmailContent
  )

  return result
}
