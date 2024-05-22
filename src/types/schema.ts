// Main Organ Rooms/Spaces Schema

import { OrganCalEventMeta } from "./event"
import { OrganPostMeta } from "./post"
import { SubTypes } from "./utils"

import * as z from "zod"

// SPACE/ROOM STATE MODEL
//
// POST
// organ.room.type = "post"
// organ.post.type = "text" | "image" | "event" | ...
// event?: string //parent
// pages?: string[] //parents
// tags?: string[] //parents
// content: {type: "text", body: string} | {type: "private", id: Event ID}  //content
//
// PAGE
// organ.space.type: "page"
// organ.page.type: "tag" | "id" | "event"
// organ.event.meta: OrganEventMeta
// pages?: string[] //linked pages (roomID)
// tags?: string[] //parents (roomID)
// pinned: string[] //pinned posts or events (roomID)
//
// TAG
// organ.space.type = "tag"
// pinned?: string[] //pinned pages, events or posts (children) (roomID)
// canonical?: string //page (child) (roomID)
// pages: Map<RoomID, PageName> // children (essentially a cached AS aggregation)
//
// INDEX
// organ.space.type = "index"
// organ.index.type = "tag" | "user"
// tags: Map<RoomID, Tag> // children (essentially a cached AS aggregation)

// some ambiguities:
// - should 'event' be a subtype of page or its own type? given that
//   events may be children of ID pages?

export const organRoomType = "organ.room.type"
export const organSpaceType = "organ.space.type"
export const organPostType = "organ.post.type"
export const organPageType = "organ.page.type"
export const organIndexType = "organ.index.type"

export const organRoomTypeValue = {
  id: "id", // deprecated
  event: "event", // deprecated
  post: "post",
} as const

export const organSpaceTypeValue = {
  index: "index",
  tag: "tag",
  page: "page",
  event: "event",
} as const

export const OrganRoomTypeTree = z.object({
  index: z.object({
    tag: z.literal("tag"),
    user: z.literal("user"),
  }),
  tag: z.literal("tag"),
  page: z.object({
    tag: z.literal("tag"),
    id: z.literal("id"),
  }),
  event: z.literal("event"),
  post: z.object({
    text: z.literal("text"),
    image: z.literal("image"),
    event: z.literal("event"),
  }),
  bus: z.literal("bus"),
})

export const organRoomTypeTree = {
  index: {
    tag: "tag",
    user: "user",
  },
  tag: "tag",
  page: {
    tag: "tag",
    id: "id",
  },
  event: "event",
  post: {
    text: "text",
    image: "image",
    event: "event",
  },
  bus: "bus",
} as const

export type RoomTypes = keyof typeof organRoomTypeTree

// export const RoomTypesSchema = z.union(
//   ""
// )

// Other Event Types

export const organRoomUserNotifications = "organ.room.user.notifications"
export const organRoomSecretEmail = "organ.room.secret.email"
export const organBusPost = "organ.bus.post"
export type OrganBusPostContent = { id: string }

export type OrganEntity = {
  roomId: string
  name: string
  topic: string
  roomType: RoomTypes
  pageType?: SubTypes<"page">
  postType?: SubTypes<"post">
  alias?: string
  eventMeta?: OrganCalEventMeta
  postMeta?: OrganPostMeta
  timestamp?: number
}

export const OrganEntitySchema = z.object({
  roomId: z.string({ invalid_type_error: "roomId must be a string" }),
  name: z.string({ invalid_type_error: "name must be a string" }),
  topic: z.string({ invalid_type_error: "topic must be a string" }),
  roomType: z.string({ invalid_type_error: "roomType must be a string" }),
})
