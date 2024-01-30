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

export const organRoomTypeValue = {
  id: "id",
  event: "event",
} as const

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
