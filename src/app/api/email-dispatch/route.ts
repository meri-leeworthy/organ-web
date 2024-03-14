const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env
import { getSecretFromRoom } from "@/lib/roomSecretStore"
import { sendEmail } from "@/lib/sendEmail"
import {
  OrganCalEventUnstable,
  OrganPostUnstable,
  organRoomSecretEmail,
  organRoomUserNotifications,
} from "@/lib/types"
import { NextRequest, NextResponse } from "next/server"
import { Client, Room } from "simple-matrix-sdk"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    roomId,
    post,
  }: { roomId: string; post: OrganPostUnstable | OrganCalEventUnstable } = body

  // this endpoint probably should be authenticated - only admins should be able to call it

  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch,
    params: {
      user_id: "@_relay_bot:" + SERVER_NAME,
    },
  })
  const room = new Room(roomId, client)

  const name = await room.getName()
  if (typeof name === "object" && name !== null && "errcode" in name)
    return NextResponse.json({
      now: Date.now(),
      message: "Couldn't get name",
      errcode: name.errcode,
      error: ("error" in name && name.error) || "",
    })
  console.log("name", name)

  const nameString =
    typeof name === "object" && name !== null && "name" in name
      ? name.name
      : "unnamed room"

  const state = await room.getState()
  // console.log("state", state)

  // get all the state events with organ.room.user.notifications

  if (typeof state === "object" && "errcode" in state) return state

  const notificationPrefsMapIterator = state
    .getAll(organRoomUserNotifications)
    ?.values()
  const notificationPrefs = notificationPrefsMapIterator
    ? Array.from(notificationPrefsMapIterator)
    : []

  const hashes = notificationPrefs
    .filter((event: any) => {
      return (
        event.type === organRoomUserNotifications &&
        event.content.email === "every"
      )
    })
    .map((event: any) => {
      return event.state_key
    })

  console.log("hashes", hashes)

  hashes.forEach(async (hash: string) => {
    const mailboxRoomId = await client.getRoomIdFromAlias(
      `%23relay_${hash}%3A${SERVER_NAME}`
    )
    console.log(hash, "-->", mailboxRoomId)
    if (!mailboxRoomId) return
    if (typeof mailboxRoomId === "object" && "errcode" in mailboxRoomId) return
    const email = await getSecretFromRoom(mailboxRoomId, organRoomSecretEmail)
    console.log("email", email)
    if (!email || "errcode" in email) return
    // const room = new Room(roomId, client)
    //
    const emailHTML = `
          ${post.title ? "<h1>" + post.title + "</h1>" : ""}
          <p>${post.body}</p>
          <p>
            <a href="https://organ.is/unsubscribe?email=${
              email.body
            }&room=${roomId}">
              unsubscribe
            </a>
          </p>

      `

    //<!DOCTYPE html>
    // <html lang="en">
    //   <head>
    //     <meta charset="UTF-8" />
    //   </head>
    //   <body>
    //         </body>
    // </html>

    await sendEmail(
      email.body,
      `New post from ${nameString} on Organ `,
      emailHTML, // + emailTitle + post.body + unsubscribeFooter,
      post.title +
        "\n\n" +
        post.body +
        "\n\n" +
        "unsubscribe: https://organ.is/unsubscribe?email=" +
        email.body +
        "&room=" +
        roomId
    )
  })

  return NextResponse.json({
    now: Date.now(),
    message: "Dispatched!",
  })
}
