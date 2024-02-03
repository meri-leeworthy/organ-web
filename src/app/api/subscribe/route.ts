import { getSecretFromRoom, storeSecretInRoom } from "@/lib/roomSecretStore"
import { sendEmailFromMailbox } from "@/lib/sendEmail"
import { NextRequest, NextResponse } from "next/server"
import { subscribeEmailToRoom } from "./actions"
import { getHmac32 } from "@/lib/getHmac"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, slug }: { email: string; slug?: string } = body

  //if slug is defined, this endpoint is to send a custom event into the room

  // const hash = getHmac32(email)

  if (!slug)
    return NextResponse.json({
      now: Date.now(),
      message: "Failed to join room!",
      errcode: "",
      error: "No slug in params",
    })

  // if (slug) {
  const res = subscribeEmailToRoom(`!${slug}:radical.directory`, email)

  if ("errcode" in res)
    return NextResponse.json({
      now: Date.now(),
      message: "Failed to join room!",
      errcode: res.errcode,
      error: "error" in res && res.error,
    })

  return NextResponse.json({
    now: Date.now(),
    message: "Subscribed!",
  })
  // } else {
  //   const result = await sendEmailFromMailbox(
  //     `relay_${hash}`,
  //     email as string,
  //     "You just signed up for Organ updates!",
  //     welcomeEmailContent
  //   )
  //   console.log("send email from mailbox result", result)
  //   const secretEvent = await getSecretFromRoom(
  //     "!NUVsYlMWcttFfEHkCj:radical.directory",
  //     "emails"
  //   )
  //   if ("errcode" in secretEvent) throw new Error("No emails secret found")
  //   const secret = secretEvent.body

  //   const json = JSON.parse(secret as string) as string[]

  //   const set = new Set(json)
  //   set.add(email)

  //   console.log("secret", json)
  //   const store = await storeSecretInRoom(
  //     "!NUVsYlMWcttFfEHkCj:radical.directory", //chamber of secrets
  //     "emails",
  //     JSON.stringify([...set.values()])
  //   )

  //   return NextResponse.json({
  //     now: Date.now(),
  //     message: "Subscribed!",
  //   })
  // }
}

const welcomeEmailContent = `
  Hi, thanks for signing up to get updates about Organ!

  This project is really early in development (and totally unfunded). One way you can help is by letting me know if something is going wrong. If you have any feedback, questions, or just want to say hi, please reply to this email.
`
