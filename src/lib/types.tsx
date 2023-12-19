export const contactTypes = {
  email: "email",
  website: "website",
  twitter: "twitter",
  instagram: "instagram",
  facebook: "facebook",
  newsletter: "newsletter",
  linktree: "linktree",
} as const
export type ContactType = keyof typeof contactTypes

export const organCalEventUnstable = "organ.event.unstable"

export type OrganCalEventUnstable = {
  title: string
  body: string
  tags: string[]
  msgtype: typeof organCalEventUnstable
  host: { name: string; id: string }
  datetime: string
  location?: string
  avatar?: string
}

export type OrganMetaContactUnstable = {
  type: ContactType
  value: string
}

export const organMetaContactUnstable = "organ.meta.contact.unstable"

export const organPostUnstable = "organ.post.unstable"

export type OrganPostUnstable = {
  title: string
  body: string
  tags: string[]
  msgtype: typeof organPostUnstable
  author: { name: string; id: string }
  media: string[]
}

export type Chunk = {
  type: string
  event_id: string
  content: { body: string; msgtype?: string; "m.relates_to"?: any }
}[] &
  Event[]
