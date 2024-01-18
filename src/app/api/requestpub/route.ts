const { MATRIX_BASE_URL, AS_TOKEN } = process.env
import { NextRequest, NextResponse } from "next/server"
import { Client, Room } from "simple-matrix-sdk"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { roomId }: { roomId: string } = body

  if (roomId) {
    const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
      fetch,
      params: { user_id: "@_relay_bot:radical.directory" },
    })
    const room = new Room("!QHXlZWoaRZChVXWPUm:radical.directory", client)

    const res = await room.sendMessage({
      msgtype: "m.text",
      body: "Requested " + roomId,
    })

    console.log("res", res)

    return NextResponse.json({
      joined: true,
      now: Date.now(),
      message: "AS Requested Publication of Room",
    })
  }

  return NextResponse.json({
    requested: false,
    now: Date.now(),
    message: "No Room ID provided",
  })
}
