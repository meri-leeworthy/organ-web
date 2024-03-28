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
export const organRoomSecretEmail = "organ.room.secret.email"

export const organRoomType = "organ.room.type"
export const organRoomTypeValue = {
  id: "id",
  event: "event",
  post: "post",
} as const

export const organLocation = "organ.location"
export type OrganLocation =
  | {
      type: "text"
      value: string
    }
  | {
      type: "page"
      value: string //RoomID
    }

export const organPageEventMeta = "organ.page.event.meta"
export type OrganPageEventMeta = {
  type: typeof organPageEventMeta
  content: {
    start: string
    end: string
    allDay?: boolean
    location?: OrganLocation
    url?: string
  }
}

export const organSpaceType = "organ.space.type"
export const organSpaceTypeValue = {
  index: "index",
  tag: "tag",
  page: "page",
} as const

export const organPostType = "organ.post.type"
export const organPostTypeValue = {
  text: "text",
  image: "image",
  event: "event",
} as const

export const organPageType = "organ.page.type"
export const organPageTypeValue = {
  tag: "tag",
  id: "id",
  event: "event",
} as const

export const organIndexType = "organ.index.type"
export const organIndexTypeValue = {
  tag: "tag",
  user: "user",
} as const

export const organPostText = "organ.post.text"
export type OrganPostText = {
  type: typeof organPostText
  content: { value: string }
}

export const organPostMeta = "organ.post.meta"
export type OrganPostMetaState = {
  type: typeof organPostMeta
  content: OrganPostMeta
}

export type OrganPostMeta = {
  title?: string
  body: string
  timestamp: number
  author: OrganAuthor
}

export const organRoomTypeTree = {
  index: {
    tag: "tag",
    user: "user",
  },
  tag: "tag",
  page: {
    tag: "tag",
    id: "id",
    event: "event",
  },
  post: {
    text: "text",
    image: "image",
    event: "event",
  },
} as const

export type RoomTypes = keyof typeof organRoomTypeTree
export type SubTypes<T> = T extends RoomTypes
  ? (typeof organRoomTypeTree)[T] extends string
    ? never
    : keyof (typeof organRoomTypeTree)[T]
  : never

export type OrganAuthor = { type: "user" | "id"; value: string }

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
