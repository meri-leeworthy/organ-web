"use server"

import { getHmac32 } from "@/lib/getHmac"
import { storeSecretInRoom } from "@/lib/roomSecretStore"
import { getOrCreateMailboxId, sendEmailFromMailbox } from "@/lib/sendEmail"
import {
  organRoomSecretEmail,
  organRoomUserNotifications,
} from "@/types/schema"
import { Client, Room } from "simple-matrix-sdk"

const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

export async function subscribeEmailToRoom(roomId: string, email: string) {
  const mailboxRoomId = await getOrCreateMailboxId(email)
  const stored = await storeSecretInRoom(
    mailboxRoomId as string,
    organRoomSecretEmail,
    email
  )
  console.log("stored", stored)

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

  const pageSpecificWelcomeEmailContent = `
  Hi, confirming you just signed up to get updates about ${nameString} on Organ!
`

  const res = await room.sendStateEvent(
    organRoomUserNotifications,
    {
      email: "every",
    },
    hash
  )

  console.log("state sent", res)

  if ("errcode" in res) return res

  //send confirmation email to user

  const result = await sendEmailFromMailbox(
    `relay_${hash}`,
    email as string,
    `You just signed up for updates for ${nameString} on Organ!`,
    pageSpecificWelcomeEmailContent,
    pageSpecificWelcomeEmailContent
  )

  return result
}
