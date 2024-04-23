import * as v from "valibot"

// General Property Types

export const OrganAuthorSchema = v.object({
  type: v.union([v.literal("user"), v.literal("id")]),
  value: v.string(),
})
export type OrganAuthor = v.Output<typeof OrganAuthorSchema>

export const OrganLocationSchema = v.union([
  v.object({
    type: v.literal("text"),
    value: v.string(),
  }),
  v.object({
    type: v.literal("page"),
    value: v.string(), // RoomID
  }),
])

export type OrganLocation = v.Output<typeof OrganLocationSchema>

export type OrganMetaContactUnstable = {
  type: ContactType
  value: string[]
}

export const organMetaContactUnstable = "organ.meta.contact.unstable"

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
