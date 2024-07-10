// Main Organ Rooms/Spaces Schema

import { OrganCalEventMeta, OrganCalEventMetaSchema } from "./event"
import { OrganPostMeta, OrganPostMetaSchema } from "./post"
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
// organ.page.type: "tag" | "id"
// organ.event.meta: OrganEventMeta
// pages?: string[] //linked pages (roomID)
// tags?: string[] //parents (roomID)
// pinned: string[] //pinned posts or events (roomID)
//
// EVENT
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

// export const organRoomType = "organ.room.type"
// export const organSpaceType = "organ.space.type"
// export const organPostType = "organ.post.type"
// export const organPageType = "organ.page.type"
// export const organIndexType = "organ.index.type"

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

export const RoomTypesSchema = z.union([
  z.literal("index"),
  z.literal("tag"),
  z.literal("page"),
  z.literal("event"),
  z.literal("post"),
  z.literal("bus"),
])

export type EntityTypes = z.infer<typeof RoomTypesSchema>

export function SubTypesSchema(entityType: EntityTypes) {
  switch (entityType) {
    case "index":
      return z.union([z.literal("tag"), z.literal("user")])
    case "page":
      return z.union([z.literal("tag"), z.literal("id")])
    case "post":
      return z.union([
        z.literal("text"),
        z.literal("image"),
        z.literal("event"),
      ])
    default:
      return z.undefined()
  }
}

// Other Event Types

export const organRoomUserNotifications = "organ.room.user.notifications"
export const organRoomSecretEmail = "organ.room.secret.email"
export const organBusPost = "organ.bus.post"
export type OrganBusPostContent = { id: string }

export const OrganEntityBaseSchema = z.object({
  roomId: z.string({ invalid_type_error: "roomId must be a string" }),
  name: z.string({ invalid_type_error: "name must be a string" }),
  topic: z.string({ invalid_type_error: "topic must be a string" }),
  alias: z.string({ invalid_type_error: "alias must be a string" }).optional(),
  timestamp: z
    .number({ invalid_type_error: "timestamp must be a number" })
    .optional(),
  entityType: z.string({ invalid_type_error: "room type must be a string" }),
  subType: z
    .string({ invalid_type_error: "sub type must be a string" })
    .optional(),
  meta: z.unknown(),
})

export type OrganEntityBase = z.infer<typeof OrganEntityBaseSchema>
export type OrganEntity<
  TEntityType extends EntityTypes,
  TSubType extends SubTypes<TEntityType> = never
> = OrganEntityBase & {
  entityType: TEntityType
  subType?: TSubType
  meta?: TEntityType extends "event"
    ? OrganCalEventMeta
    : TEntityType extends "post"
    ? OrganPostMeta
    : unknown
}

// returns a schema for a specific entity type
export function OrganEntitySchema<
  TEntityType extends EntityTypes,
  TSubType extends SubTypes<TEntityType>
>(
  entityType: TEntityType,
  subType?: TSubType
): z.ZodType<OrganEntity<TEntityType, TSubType>> {
  // to help TS infer the correct type, omit fields that will be replaced and narrowed
  const baseSchema = OrganEntityBaseSchema.omit({
    entityType: true,
    subType: true,
    meta: true,
  })

  const entityTypeSchema = z.object({ entityType: z.literal(entityType) })
  const subTypeSchema = subType
    ? z.object({ subType: z.literal(subType) })
    : z.object({ subType: z.undefined() })

  let metaSchema: z.AnyZodObject | null = null
  if (entityType === "event") {
    metaSchema = z.object({ meta: OrganCalEventMetaSchema })
  } else if (entityType === "post") {
    metaSchema = z.object({ meta: OrganPostMetaSchema })
  }

  let mergedSchema = baseSchema.merge(entityTypeSchema).merge(subTypeSchema)

  if (metaSchema !== null) {
    mergedSchema = mergedSchema.merge(metaSchema)
  }

  return mergedSchema as unknown as z.ZodType<
    OrganEntity<TEntityType, TSubType>
  >
}

export const organType = "organ.type"
export const OrganTypeBase = z.object({
  type: RoomTypesSchema,
  subtype: z.string().optional(),
})

export function OrganType(entityType: EntityTypes) {
  const subType = SubTypesSchema(entityType)
  return OrganTypeBase.merge(
    z.object({
      type: z.literal(entityType),
      subtype: subType,
    })
  )
}
export type OrganType = z.infer<typeof OrganTypeBase>

export const organMeta = "organ.meta"
export function OrganMeta<TEntityType extends EntityTypes>(
  entityType: TEntityType,
  subType?: SubTypes<TEntityType>
) {
  return entityType === "event"
    ? OrganCalEventMetaSchema
    : entityType === "post"
    ? OrganPostMetaSchema
    : z.undefined()
}
