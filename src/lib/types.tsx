import {
  Output,
  array,
  boolean,
  literal,
  object,
  optional,
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
})

export type OrganCalEventUnstable = Output<typeof OrganCalEventUnstableSchema>

export type OrganMetaContactUnstable = {
  type: ContactType
  value: string[]
}

export const organMetaContactUnstable = "organ.meta.contact.unstable"

export const organPostUnstable = "organ.post.unstable"

export const OrganPostUnstableSchema = object({
  title: string(),
  body: string(),
  tags: array(string()),
  msgtype: literal(organPostUnstable),
  author: object({ name: string(), id: string() }),
  media: array(string()),
})

export type OrganPostUnstable = Output<typeof OrganPostUnstableSchema>

export type Chunk = {
  type: string
  event_id: string
  content: { body: string; msgtype?: string; "m.relates_to"?: any }
}[] &
  Event[]
