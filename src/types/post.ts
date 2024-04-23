import * as v from "valibot"

// Post

import { OrganAuthor, OrganAuthorSchema } from "./properties"
import { StateEvent } from "./utilities"

export const organPostMeta = "organ.post.meta"

export type OrganPostMetaState = StateEvent<typeof organPostMeta, OrganPostMeta>

export const OrganPostMetaSchema = v.object({
  title: v.optional(v.string()),
  body: v.string(),
  timestamp: v.number(),
  author: OrganAuthorSchema,
})

export type OrganPostMeta = v.Output<typeof OrganPostMetaSchema>
