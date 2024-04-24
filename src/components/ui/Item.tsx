"use client"

import {
  getContextualDate,
  getIdLocalPart,
  isOrganRoomType,
  props,
} from "@/lib/utils"
import { client } from "@/lib/client"
import { ClientEventSchema, Room } from "simple-matrix-sdk"
import * as v from "valibot"
import Link from "next/link"
// import { Event } from "@/components/ui/Events"
import { Card } from "./card"
import { organPageEventMeta } from "@/types/event"
import { Child } from "@/components/ui/ChildrenCarousel"

export function Item({ id }: { id: Child }) {
  return (
    <Link
      href={`/id/${id.alias?.split("#relay_id_")[1].split(":")[0]}`}
      key={id.roomId}>
      <FlexGridListItem>
        <h3 className="font-medium py-1">{id.name}</h3>
        <p>{id.topic}</p>
      </FlexGridListItem>
    </Link>
  )
}

export function Event({ id }: { id: string }) {
  // const room = client.getRoom(id)
  // const state = await room.getState()
  // if ("errcode" in state) return JSON.stringify(state)
  // console.log(id, "state", state)
  // console.log("roomtype", state.get("organ.room.type"))
  // const validPost = isOrganRoomType(state, "page", "event")
  // if (!validPost) return null
  // const event = state.get(organPageEventMeta)
  // if (!event) return "no event"

  // const nameEvent = state.get("m.room.name")
  // const name = props(nameEvent, "content", "name")
  // if (typeof name !== "string") return "no name"

  // const topicEvent = state.get("m.room.topic")
  // const topic = props(topicEvent, "content", "topic")
  // if (typeof topic !== "string") return "no topic"

  // const start = props(event, "content", "start")
  // const end = props(event, "content", "end")
  // if (typeof start !== "string" || typeof end !== "string") return "no content"

  // const date = new Date(timestamp)
  return <div>hi</div>

  // const date = getContextualDate(parseInt(start))

  // return (
  //   // <Link href={"/event/" + getIdLocalPart(id)}>
  //   <FlexGridListItem>
  //     <time className="text-xs uppercase">{date}</time>
  //     <h3 className="flex items-start gap-1 font-medium">
  //       {/* <IconCalendarEvent className="m-1" size={20} /> */}
  //       {name}
  //     </h3>
  //     <p>{topic}</p>
  //     {/* <time className="text-xs uppercase">{getContextualDate(timestamp)}</time> */}
  //   </FlexGridListItem>
  // </Link>
  // )
}

// export function FlexGridListItem({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="my-4 sm:w-80 transition list-none">
//       {/* <div className="absolute inset-0 border-t border-green-400 transition group-hover:border-t-4"></div> */}
//       <div className="relative z-10">{children}</div>
//     </div>
//   )
// }

export function FlexGridListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="my-4 w-full sm:w-80 relative group transition list-none">
      <div className="absolute inset-0 border-t border-green-400 transition group-hover:border-t-4"></div>
      <div className="relative z-10">{children}</div>
    </li>
  )
}
