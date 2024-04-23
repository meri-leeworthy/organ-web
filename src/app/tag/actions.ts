"use server"

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX, SERVER_NAME } = process.env

import { noCacheFetch, normaliseTagString } from "@/lib/utils"
import { organSpaceType, organSpaceTypeValue } from "@/types/schema"
import { Client, ErrorSchema, Room } from "simple-matrix-sdk"
import { is } from "valibot"

const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch: noCacheFetch,
  params: { user_id: `@_relay_bot:${SERVER_NAME}` },
})

const index = new Room(TAG_INDEX!, client)

export async function createTag(opts: {
  name: string
  description: string
  // pinned?: string[] //pinned pages, events or posts (children)
  // canonical?: string //page (child)
  slug?: string
}) {
  const tagSpace = await client.createRoom({
    creation_content: { type: "m.space" },
    name: opts.name,
    topic: opts.description,
    room_alias_name: opts.slug,
    // visibility: "public",
    initial_state: [
      {
        type: "m.room.join_rules",
        content: {
          join_rule: "public",
        },
      },
      {
        type: organSpaceType,
        content: {
          type: organSpaceTypeValue.tag,
        },
      },
      {
        type: "m.space.parent",
        state_key: TAG_INDEX,
        content: {
          via: [SERVER_NAME],
        },
      },
    ],
  })

  if (is(ErrorSchema, tagSpace)) return tagSpace

  await tagIndex.sendStateEvent(
    "m.space.child",
    {
      via: [SERVER_NAME],
    },
    tagSpace.roomId
  )

  return tagSpace
}

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

const tagIndex = new Room(TAG_INDEX!, client)

export async function bilateralAdoptTag(tagRoomId: string) {
  const tagRoom = new Room(tagRoomId, client)
  const tagName = await tagRoom.getName()

  const tagNameString =
    typeof tagName === "object" &&
    tagName !== null &&
    "name" in tagName &&
    tagName.name

  // add tag as child to tag index
  const tagIndexAddChild = await tagIndex.sendStateEvent(
    "m.space.child",
    {
      order: tagNameString,
      via: [SERVER_NAME],
    },
    tagRoomId
  )

  // add tag index as parent to tag
  const tagAddParent = await tagRoom.sendStateEvent(
    "m.space.parent",
    {
      via: [SERVER_NAME],
    },
    TAG_INDEX
  )

  return { tagIndexAddChild, tagAddParent }
}

export async function bilateralTagAdoptPost(
  postRoomId: string,
  tagRoomId: string
) {
  const tagRoom = new Room(tagRoomId, client)

  const postRoom = new Room(postRoomId, client)

  // add post as child to tag space
  const tagRoomAddChild = await tagRoom.sendStateEvent(
    "m.space.child",
    {
      via: [SERVER_NAME],
    },
    postRoomId
  )

  // add tag space as parent to post
  const postAddParent = await postRoom.sendStateEvent(
    "m.space.parent",
    {
      via: [SERVER_NAME],
    },
    tagRoomId
  )

  return { tagRoomAddChild, postAddParent }
}

export async function getTagRoomId(tag: string) {
  const tagString = normaliseTagString(tag)
  const alias = `#relay_tag_${tagString}:${SERVER_NAME}`
  console.log("Alias", alias)
  return await client.getRoomIdFromAlias(alias)
}
