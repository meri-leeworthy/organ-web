// Deprecated

// export const organPostUnstable = "organ.post.unstable"

// export const organPostTypeValue = {
//   text: "text",
//   image: "image",
//   event: "event",
// } as const

// export const organPageTypeValue = {
//   tag: "tag",
//   id: "id",
//   event: "event",
// } as const

// export const organIndexTypeValue = {
//   tag: "tag",
//   user: "user",
// } as const

//

// export const OrganPostUnstableSchema = v.object({
//   title: v.string("title must be a string"),
//   body: v.string("body must be a string"),
//   tags: v.array(v.string("tags must be an array of strings")),
//   msgtype: v.literal(organPostUnstable),
//   author: v.object({
//     name: v.string("author name must be a string"),
//     id: v.string("author id must be string"),
//   }),
//   source: v.optional(v.string()),
//   media: v.optional(v.array(v.string("media must be an array of strings"))),
//   "m.new_content": v.optional(
//     v.record(v.string("m.new_content record key must be string"), v.any())
//   ),
//   "m.relates_to": v.optional(
//     v.record(v.string("m.relates_to record key must be string"), v.any())
//   ),
// })

// export type OrganPostUnstable = v.Output<typeof OrganPostUnstableSchema>

//

// export const organCalEventUnstable = "organ.event.unstable"

// export const OrganCalEventUnstableSchema = v.object({
//   title: v.string(),
//   body: v.string(),
//   tags: v.array(v.string()),
//   msgtype: v.literal(organCalEventUnstable),
//   host: v.object({
//     name: v.string(),
//     id: v.string(),
//   }),
//   start: v.string(),
//   end: v.optional(v.string()),
//   allDay: v.optional(v.boolean()),
//   location: v.optional(v.string()),
//   avatar: v.optional(v.string()),
//   source: v.optional(v.string()),
// })

// export type OrganCalEventUnstable = v.Output<typeof OrganCalEventUnstableSchema>
