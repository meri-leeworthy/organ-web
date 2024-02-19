import {
  Output,
  any,
  array,
  boolean,
  literal,
  object,
  optional,
  record,
  string,
} from "valibot"

export const contactTypes = {
  email: "email",
  website: "website",
  twitter: "twitter",
  instagram: "instagram",
  facebook: "facebook",
  newsletter: "newsletter",
  linktree: "linktree",
  link: "link",
} as const
export type ContactType = keyof typeof contactTypes

export const organCalEventUnstable = "organ.event.unstable"

export const OrganCalEventUnstableSchema = object({
  title: string(),
  body: string(),
  tags: array(string()),
  msgtype: literal(organCalEventUnstable),
  host: object({
    name: string(),
    id: string(),
  }),
  start: string(),
  end: optional(string()),
  allDay: optional(boolean()),
  location: optional(string()),
  avatar: optional(string()),
  source: optional(string()),
})

export type OrganCalEventUnstable = Output<typeof OrganCalEventUnstableSchema>

export type OrganMetaContactUnstable = {
  type: ContactType
  value: string[]
}

export const organMetaContactUnstable = "organ.meta.contact.unstable"
export const organPostUnstable = "organ.post.unstable"
export const organRoomUserNotifications = "organ.room.user.notifications"
export const organRoomType = "organ.room.type"
export const organRoomSecretEmail = "organ.room.secret.email"
export const organSpaceType = "organ.space.type"
export const organLocation = "organ.location"
export const organEventMeta = "organ.event.meta"

export const organRoomTypeValue = {
  id: "id",
  event: "event",
  post: "post",
} as const

export type OrganLocation =
  | {
      type: "text"
      value: string
    }
  | {
      type: "page"
      value: string
    }

export type OrganEventMeta = {
  type: typeof organEventMeta
  content: {
    start: string
    end: string
    allDay?: boolean
    location?: OrganLocation
    url?: string
  }
}

export const organSpaceTypeValue = {
  tagindex: "tagindex",
  userindex: "userindex",
  tag: "tag",
  page: "page",
  event: "event",
} as const

// SPACE/ROOM STATE MODEL
//
// POST
// organ.room.type = "post"
// event?: string //parent
// pages?: string[] //parents
// tags?: string[] //parents
// content: {type: "text", body: string} | {type: "private", id: Event ID}  //content
//
// EVENT
// organ.space.type = "event"
// events?: string[] //linked events (roomID)
// pages?: string[] //parents (roomID)
// tags?: string[] //parents (roomID)
//
//
// PAGE
// organ.space.type = "page"
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
// TAGINDEX
// organ.space.type = "tagindex"
// tags: Map<RoomID, Tag> // children (essentially a cached AS aggregation)

export const OrganPostUnstableSchema = object({
  title: string("title must be a string"),
  body: string("body must be a string"),
  tags: array(string("tags must be an array of strings")),
  msgtype: literal(organPostUnstable),
  author: object({
    name: string("author name must be a string"),
    id: string("author id must be string"),
  }),
  source: optional(string()),
  media: optional(array(string("media must be an array of strings"))),
  "m.new_content": optional(
    record(string("m.new_content record key must be string"), any())
  ),
  "m.relates_to": optional(
    record(string("m.relates_to record key must be string"), any())
  ),
})

export type OrganPostUnstable = Output<typeof OrganPostUnstableSchema>

export type Chunk = {
  type: string
  event_id: string
  content: { body: string; msgtype?: string; "m.relates_to"?: any }
}[] &
  Event[]
