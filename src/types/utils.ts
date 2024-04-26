// General Utility Types

import { RoomTypes, organRoomTypeTree } from "./schema"

export type StateEvent<EventTypeString, StateEventContent> = {
  type: EventTypeString
  content: StateEventContent
}

export type Chunk = {
  type: string
  event_id: string
  content: { body: string; msgtype?: string; "m.relates_to"?: any }
}[] &
  Event[]

export type SubTypes<T> = T extends RoomTypes
  ? (typeof organRoomTypeTree)[T] extends string
    ? never
    : keyof (typeof organRoomTypeTree)[T]
  : never
