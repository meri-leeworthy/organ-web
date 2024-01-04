import {
  ClientEventOutput,
  EventContentSchema,
  RoomMessageContentSchema,
} from "simple-matrix-sdk"
import { is } from "valibot"

export function deleteOldEdits(posts: ClientEventOutput[]) {
  const postsMap = new Map(posts.map(message => [message.event_id, message]))

  const toBeDeleted = new Map<string, any[]>()
  postsMap.forEach(message => {
    if (
      is(EventContentSchema, message?.content) &&
      message?.content &&
      "m.relates_to" in message.content &&
      message.content["m.relates_to"]?.rel_type === "m.replace"
    ) {
      const toBeDeletedValues =
        toBeDeleted.get(message.content["m.relates_to"].event_id) || []
      toBeDeleted.set(message.content["m.relates_to"].event_id, [
        ...toBeDeletedValues,
        message,
      ])
    }
  })
  toBeDeleted.forEach((editPosts, originalId) => {
    const mostRecentEdit = getMostRecentEventId(editPosts)

    const actuallyDelete = editPosts
      .filter(editPost => editPost.event_id !== mostRecentEdit.id)
      .map(editPost => editPost.event_id)

    actuallyDelete.forEach(id => postsMap.delete(id))

    postsMap.delete(originalId)
  })

  return [...postsMap.values()]
}

export function getMostRecentEventId(events: ClientEventOutput[]): {
  ts: number
  id: string
} {
  return events.reduce(
    ({ ts: prevTs, id: prevId }, event) => {
      if (event.origin_server_ts > prevTs || !prevTs || !prevId) {
        return { ts: event.origin_server_ts, id: event.event_id }
      } else {
        return { ts: prevTs, id: prevId }
      }
    },
    { ts: events[0].origin_server_ts, id: events[0].event_id }
  )
}
