"use server"

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX } = process.env

import { bilateralTagAdoptPost } from "@/lib/tag"
import {
  organPostText,
  organPostType,
  organPostTypeValue,
  organRoomType,
  organRoomTypeValue
} from "@/lib/types"
import { normaliseTagString } from "@/lib/utils"
import { Client, Room } from "simple-matrix-sdk"

const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch,
  params: { user_id: `@_relay_bot:radical.directory` }
})

// const index = new Room(TAG_INDEX!, client)

export async function newPost(formData: FormData) {
  const content = (formData.get("content") as string) || ""

  const postRoom = await client.createRoom({
    initial_state: [
      {
        type: organRoomType,
        content: {
          type: organRoomTypeValue.post
        }
      },
      {
        type: organPostType,
        content: {
          type: organPostTypeValue.text
        }
      },
      {
        type: organPostText,
        content: {
          value: content
        }
      }
    ]
  })

  if ("errcode" in postRoom) return postRoom

  return postRoom.roomId
}

// export async function removeTag(tagEventId: string) {
//   return await index.redactEvent(tagEventId)
// }

export async function addTagToPost(formData: FormData) {
  const tag = normaliseTagString(formData.get("tag") as string)
  const postRoomId = formData.get("postId") as string

  // check if tag space already exists

  const alias = `#relay_tag_${tag}:radical.directory`

  console.log(`alias "${alias}"`)

  const tagRoomId = await client.getRoomIdFromAlias(alias)
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId) return tagRoomId

  const adoptionResult = await bilateralTagAdoptPost(postRoomId, tagRoomId)

  return adoptionResult
}
