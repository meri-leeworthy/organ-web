const { SERVER_NAME } = process.env
import { NextRequest, NextResponse } from "next/server"
import { client } from "@/lib/client"
import { organBusPost } from "@/types/schema"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, value }: { type: string; value: string } = body

  if (type !== "post") return NextResponse.json({ message: "Not a post" })

  const postsBusId = await client.getRoomIdFromAlias(
    "#relay_bus_posts:" + SERVER_NAME
  )
  if (typeof postsBusId === "object" && "errcode" in postsBusId)
    return NextResponse.json({
      now: Date.now(),
      message: "Couldn't get posts bus id",
      ...postsBusId,
    })
  const postsBus = client.getRoom(postsBusId)

  const busResult = await postsBus.sendEvent(organBusPost, { id: value })

  return NextResponse.json({
    now: Date.now(),
    message: "Post bussed!",
    ...busResult,
  })
}
