import { getSecretFromRoom, storeSecretInRoom } from "@/lib/roomSecretStore"
import { sendEmailFromMailbox } from "@/lib/sendEmail"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email }: { email: string } = body

  const result = await sendEmailFromMailbox(
    "updates",
    email as string,
    "You just signed up for Organ updates!",
    welcomeEmailContent
  )
  console.log(result)
  const secretEvent = await getSecretFromRoom(
    "!NUVsYlMWcttFfEHkCj:radical.directory",
    "emails"
  )
  const secret =
    secretEvent.content &&
    typeof secretEvent.content === "object" &&
    "body" in secretEvent.content &&
    secretEvent.content.body

  const json = JSON.parse(secret as string) as string[]

  const set = new Set(json)
  set.add(email)

  console.log("secret", json)
  const store = await storeSecretInRoom(
    "!NUVsYlMWcttFfEHkCj:radical.directory",
    "emails",
    JSON.stringify([...set.values()])
  )

  return NextResponse.json({
    now: Date.now(),
    message: "Subscribed!",
  })
}

const welcomeEmailContent = `
  Hi, thanks for signing up to get updates about Organ!

  This project is really early in development (and totally unfunded). One way you can help is by letting me know if something is going wrong. If you have any feedback, questions, or just want to say hi, please reply to this email.
`
