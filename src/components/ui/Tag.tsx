import { IconTag } from "@tabler/icons-react"
import { Room, is, isError } from "simple-matrix-sdk"
import * as z from "zod"

export async function Tag({
  room,
  name,
  count,
}: {
  room: Room
  name?: string
  count: number
}) {
  const state = await room.getState()
  if (isError(state)) return
  const topic = state.get("m.room.topic")
  // console.log("topic", topic)
  return (
    <div className="py-2 my-2 border-[#1D170C33] rounded overflow-clip">
      <h2 className="text-base flex w-full items-center gap-1 font-bold">
        <IconTag size={16} />
        {name || room.name}
        <span className="ml-auto font-normal text-xs mr-2 text-stone-500">
          {count}
        </span>
      </h2>
      <p className="text-sm italic text-stone-600 line-clamp-3">
        {is(z.object({ topic: z.string() }), topic?.content) &&
          topic.content.topic.slice(0, 300)}
      </p>
    </div>
  )
}
