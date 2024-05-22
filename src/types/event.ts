import { OrganLocationSchema } from "./properties"
import { StateEvent } from "./utils"
import * as z from "zod"

// Event

export const organCalEventMeta = "organ.page.event.meta"

export type OrganCalEventMetaState = StateEvent<
  typeof organCalEventMeta,
  OrganCalEventMeta
>

export const OrganCalEventMetaSchema = z.object({
  start: z.string(), // Millisecond timestamp
  end: z.string(), // Millisecond timestamp
  allDay: z.optional(z.boolean()),
  location: z.optional(OrganLocationSchema),
  url: z.optional(z.string()),
})

export type OrganCalEventMeta = z.infer<typeof OrganCalEventMetaSchema>
