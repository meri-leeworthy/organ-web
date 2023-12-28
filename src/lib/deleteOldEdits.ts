import { Event } from "simple-matrix-sdk"

export function deleteOldEdits(posts: Event[]) {
  const postsMap = new Map(posts.map(message => [message.event_id, message]))

  const toBeDeleted = new Map<string, any[]>()
  postsMap.forEach(message => {
    if (
      message?.content &&
      "m.relates_to" in message.content &&
      message.content["m.relates_to"].rel_type === "m.replace"
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
    const mostRecentEdit: { ts: number; id: string } = editPosts.reduce(
      ({ ts: prevTs, id: prevId }, editPost) => {
        if (editPost.origin_server_ts > prevTs || !prevTs || !prevId) {
          return { ts: editPost.origin_server_ts, id: editPost.event_id }
        } else {
          return { ts: prevTs, id: prevId }
        }
      },
      { ts: editPosts[0].origin_server_ts, id: editPosts[0].event_id }
    )

    const actuallyDelete = editPosts
      .filter(editPost => editPost.event_id !== mostRecentEdit.id)
      .map(editPost => editPost.event_id)

    actuallyDelete.forEach(id => postsMap.delete(id))

    postsMap.delete(originalId)
  })

  return [...postsMap.values()]
}
