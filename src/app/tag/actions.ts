"use server"

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX, SERVER_NAME } = process.env

import { bilateralAdoptTag } from "@/lib/tag"
import { organSpaceType, organSpaceTypeValue } from "@/lib/types"
import { normaliseTagString } from "@/lib/utils"
import { Client, Room } from "simple-matrix-sdk"

const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch,
  params: { user_id: `@_relay_bot:${SERVER_NAME}` },
})

const index = new Room(TAG_INDEX!, client)

export async function addTag(formData: FormData) {
  const unNormalisedTag = (formData.get("tag") as string) || ""
  const tag = normaliseTagString(unNormalisedTag)

  // a few considerations
  // 1. tags have some kind of 1-1 mapping with aliases, e.g. `climate change` <-> 'climate_change'
  // 2. only some tag strings are valid, e.g. alphanumeric only
  // 3. some tags should be 'aliases' for other tags, e.g. 'climate' and 'climate change'

  const tagRoom = await client.createRoom({
    name: tag,
    creation_content: {
      type: "m.space",
    },
    initial_state: [
      {
        type: organSpaceType,
        content: {
          type: organSpaceTypeValue.tag,
        },
      },
    ],
    room_alias_name: `relay_tag_${tag}`,
  })

  if ("errcode" in tagRoom) return tagRoom

  const add = await bilateralAdoptTag(tagRoom.roomId)

  console.log("add", add)

  return add
}

export async function removeTag(tagEventId: string) {
  return await index.redactEvent(tagEventId)
}
