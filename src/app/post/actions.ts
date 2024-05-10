"use server"

const { SERVER_NAME } = process.env

import { bilateralTagAdoptPost } from "@/app/tag/actions"
import { client } from "@/lib/client"
import { normaliseTagString } from "@/lib/utils"
import { organPostMeta } from "@/types/post"
import {
  organPostType,
  organRoomType,
  organRoomTypeTree,
  organRoomTypeValue,
} from "@/types/schema"

// const index = new Room(TAG_INDEX!, client)

export async function newPost(formData: FormData) {
  const userId = (formData.get("userId") as string) || ""
  const title = (formData.get("title") as string) || ""
  const content = (formData.get("content") as string) || ""

  console.log("content", content, "userId", userId)

  const postRoom = await client.createRoom({
    invite: [userId],
    initial_state: [
      {
        type: organRoomType,
        content: {
          type: organRoomTypeValue.post,
        },
      },
      {
        type: organPostType,
        content: {
          type: organRoomTypeTree.post.text,
        },
      },
      {
        type: organPostMeta,
        content: {
          title,
          timestamp: new Date().valueOf(),
          body: content,
          author: { type: "user", value: "@_relay_bot:" + SERVER_NAME },
        },
      },
    ],
  })

  if ("errcode" in postRoom) return postRoom

  return postRoom.roomId
}

// export async function removeTag(tagEventId: string) {
//   return await index.redactEvent(tagEventId)
// }

export async function addTagToPost(formData: FormData) {
  const tag = normaliseTagString((formData.get("tag") as string) || "")
  if (!tag) return { errcode: "M_INVALID_TAG" }
  const postRoomId = formData.get("postId") as string
  if (!postRoomId) return { errcode: "M_INVALID_POST" }

  console.log("tag", tag, "postRoomId", postRoomId)

  // check if tag space already exists

  const alias = `#relay_tag_${tag}:${SERVER_NAME}`

  console.log(`alias "${alias}"`)

  const tagRoomId = await client.getRoomIdFromAlias(alias)
  console.log("tagRoomId", tagRoomId)
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId) return tagRoomId

  // try {
  //   const adoptionResult = await bilateralTagAdoptPost(postRoomId, tagRoomId)
  //   return adoptionResult
  // } catch (e) {
  //   return e
  // }
}

export async function createPost(opts: {
  owner: string
  title?: string
  body: string
  // event?: string //parent
  // pages?: string[] //parents
  // tags?: string[] //parents
}) {
  const postRoom = await client.createRoom({
    name: opts.title,
    topic: opts.body,
    // visibility: "public",
    invite: [opts.owner],
    initial_state: [
      {
        type: "m.room.join_rules",
        content: {
          join_rule: "public",
        },
      },
      {
        type: organRoomType,
        content: {
          type: organRoomTypeValue.post,
        },
      },
    ],
  })

  return postRoom
  // set organ.room.type = post
  // create a page as relay bot
  // invite user creator as admin
  // set name to title
  // set topic to body
  // set preset to public world readable
  // set history visibility to shared
  //
  // adding media comes later (not in this function)
}
