import { getHmac32 } from "@/lib/getHmac"
import { getOrCreateMailboxId } from "@/lib/sendEmail"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")
  const username = request.nextUrl.searchParams.get("username")

  if (email) {
    const mailboxId = await getOrCreateMailboxId(email, username || undefined)

    return NextResponse.json({
      joined: true,
      mailboxId,
      hash: getHmac32(email),
      now: Date.now(),
      message: "AS Joined Room",
    })
  }

  return NextResponse.json({
    joined: false,
    now: Date.now(),
    message: "Email not provided",
  })
}
