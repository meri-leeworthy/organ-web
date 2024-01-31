import { getSecretFromRoom, storeSecretInRoom } from "@/lib/roomSecretStore"
import { sendEmailFromMailbox } from "@/lib/sendEmail"
import { NextRequest, NextResponse } from "next/server"
import { unsubscribeEmailFromRoom } from "./actions"
import { getHmac32 } from "@/lib/getHmac"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, slug }: { email: string; slug?: string } = body

  //if slug is defined, this endpoint is to send a custom event into the room

  const hash = getHmac32(email)

  if (slug) {
    const res = unsubscribeEmailFromRoom(`!${slug}:radical.directory`, hash)
    if ("errcode" in res)
      return NextResponse.json({
        now: Date.now(),
        message: "Failed to join room!",
        errcode: res.errcode,
        error: "error" in res && res.error,
      })
    //send confirmation email to user

    const result = await sendEmailFromMailbox(
      `relay_${hash}`,
      email as string,
      "You just unsubscribed from updates for a specific page on Organ!",
      welcomeEmailContent
    )

    return NextResponse.json({
      now: Date.now(),
      message: "Subscribed!",
    })
  } else {
    const result = await sendEmailFromMailbox(
      `relay_${hash}`,
      email as string,
      "You have successfully unsubscribed from Organ",
      welcomeEmailContent
    )
    console.log("send email from mailbox result", result)
    const secretEvent = await getSecretFromRoom(
      "!NUVsYlMWcttFfEHkCj:radical.directory",
      "emails"
    )
    if ("errcode" in secretEvent) throw new Error("No emails secret found")
    const secret = secretEvent.body

    const json = JSON.parse(secret as string) as string[]

    const set = new Set(json)
    set.delete(email) // is this right?

    console.log("secret", json)
    const store = await storeSecretInRoom(
      "!NUVsYlMWcttFfEHkCj:radical.directory", //chamber of secrets
      "emails",
      JSON.stringify([...set.values()])
    )

    return NextResponse.json({
      now: Date.now(),
      message: "Subscribed!",
    })
  }
}

const welcomeEmailContent = `
Hi, just an email to confirm that you have unsubscribed from updates for Organ. If you're having any issues or feedback, please email me at radical.directory@protonmail.com
`

const unsubscribeEmailContent = `
  Hi, just an email to confirm that you have unsubscribed from updates for a specific page on Organ. If you're having any issues or feedback, please email me at radical.directory@protonmail.com
`
