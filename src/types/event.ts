import * as v from "valibot"
import { OrganLocationSchema } from "./properties"
import { StateEvent } from "./utils"

// Event

export const organCalEventMeta = "organ.page.event.meta"

export type OrganCalEventMetaState = StateEvent<
  typeof organCalEventMeta,
  OrganCalEventMeta
>

export const OrganCalEventMetaSchema = v.object({
  start: v.string(), // Millisecond timestamp
  end: v.string(), // Millisecond timestamp
  allDay: v.optional(v.boolean()),
  location: v.optional(OrganLocationSchema),
  url: v.optional(v.string()),
})

export type OrganCalEventMeta = v.Output<typeof OrganCalEventMetaSchema>
