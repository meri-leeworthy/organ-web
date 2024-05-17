import * as v from "valibot"

// Post

import { OrganAuthorSchema } from "./properties"
import { StateEvent } from "./utils"

export const organPostMeta = "organ.post.meta"

export type OrganPostMetaState = StateEvent<typeof organPostMeta, OrganPostMeta>

export const OrganPostMetaSchema = v.object(
  {
    title: v.optional(v.string("title must be a string")),
    body: v.string("body must be a string"),
    timestamp: v.number("timestamp must be a number"),
    author: OrganAuthorSchema,
  },
  "OrganPostMeta"
)

export type OrganPostMeta = v.Output<typeof OrganPostMetaSchema>
