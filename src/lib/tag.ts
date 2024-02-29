"use server"
import { Client, Room } from "simple-matrix-sdk"
import { normaliseTagString } from "./utils"

const { MATRIX_BASE_URL, AS_TOKEN, TAG_INDEX } = process.env

const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch,
  params: { user_id: "@_relay_bot:radical.directory" }
})

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
      via: ["radical.directory"]
    },
    tagRoomId
  )

  // add tag index as parent to tag
  const tagAddParent = await tagRoom.sendStateEvent(
    "m.space.parent",
    {
      via: ["radical.directory"]
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
      via: ["radical.directory"]
    },
    postRoomId
  )

  // add tag space as parent to post
  const postAddParent = await postRoom.sendStateEvent(
    "m.space.parent",
    {
      via: ["radical.directory"]
    },
    tagRoomId
  )

  return { tagRoomAddChild, postAddParent }
}

export async function searchTags(tag: string) {
  const tagRoomId = await client.getRoomIdFromAlias(
    `#relay_tag_${normaliseTagString(tag)}:radical.directory`
  )
  if (typeof tagRoomId === "object" && "errcode" in tagRoomId) return tagRoomId
  const tagRoom = new Room(tagRoomId, client)
  const tagState = await tagRoom.getState()
  if ("errcode" in tagState) return tagState
  const children = tagState.getAll("m.space.child")
  // console.log(tag, "children", children)
  return children
}
