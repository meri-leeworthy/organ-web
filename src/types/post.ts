import * as z from "zod"

// Post

import { OrganAuthorSchema } from "./properties"
import { StateEvent } from "./utils"
import { organMeta } from "./schema"

// export const organPostMeta = "organ.post.meta"

export type OrganPostMetaState = StateEvent<typeof organMeta, OrganPostMeta>

export const OrganPostMetaSchema = z.object(
  {
    title: z.optional(
      z.string({ invalid_type_error: "title must be a string" })
    ),
    body: z.string({ invalid_type_error: "body must be a string" }),
    timestamp: z.number({ invalid_type_error: "timestamp must be a number" }),
    author: OrganAuthorSchema,
  },
  { invalid_type_error: "OrganPostMeta" }
)

export type OrganPostMeta = z.infer<typeof OrganPostMetaSchema>
