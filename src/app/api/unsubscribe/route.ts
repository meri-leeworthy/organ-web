import { NextRequest, NextResponse } from "next/server"
import { unsubscribeEmailFromRoom } from "./actions"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, roomId }: { email: string; roomId: string } = body

  if (!roomId || !email)
    return NextResponse.json({
      now: Date.now(),
      message: "Failed to join room!",
      errcode: "",
      error: "slug and email params are required",
    })

  const res = await unsubscribeEmailFromRoom(roomId, email)
  console.log("res", res)

  if (res && "errcode" in res)
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
}
