import * as z from "zod"

// General Property Types

export const OrganAuthorSchema = z.object({
  type: z.union([z.literal("user"), z.literal("id")]),
  value: z.string(),
})
export type OrganAuthor = z.infer<typeof OrganAuthorSchema>

export const OrganLocationSchema = z.union([
  z.object({
    type: z.literal("text"),
    value: z.string(),
  }),
  z.object({
    type: z.literal("page"),
    value: z.string(), // RoomID
  }),
])

export type OrganLocation = z.infer<typeof OrganLocationSchema>

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
