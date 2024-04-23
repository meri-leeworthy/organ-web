import * as v from "valibot"
import { OrganLocationSchema } from "./properties"
import { StateEvent } from "./utilities"

// Event

export const organPageEventMeta = "organ.page.event.meta"

export type OrganPageEventMetaState = StateEvent<
  typeof organPageEventMeta,
  OrganPageEventMeta
>

export const OrganPageEventMetaSchema = v.object({
  start: v.string(),
  end: v.string(),
  allDay: v.optional(v.boolean()),
  location: v.optional(OrganLocationSchema),
  url: v.optional(v.string()),
})

export type OrganPageEventMeta = v.Output<typeof OrganPageEventMetaSchema>
