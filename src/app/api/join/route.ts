import { NextRequest, NextResponse } from "next/server"
import { joinRoom } from "./action"

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get("roomId")

  if (roomId) {
    joinRoom(roomId, "bot")
    return NextResponse.json({
      joined: true,
      now: Date.now(),
      message: "AS Joined Room",
    })
  }

  return NextResponse.json({
    joined: false,
    now: Date.now(),
    message: "No Room ID provided",
  })
}
