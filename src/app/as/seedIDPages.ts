"use server"
import {
  organPageType,
  organRoomTypeTree,
  organSpaceType,
  organSpaceTypeValue,
} from "@/types/schema"
import ids from "./seed/ids.json"
import { noCacheClient as client } from "@/lib/client"
import { ErrorSchema, is } from "simple-matrix-sdk"

const { SERVER_NAME } = process.env

export async function seedIDPages() {
  const tagIndexRoomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )
  if (typeof tagIndexRoomId === "object" && "errcode" in tagIndexRoomId)
    return tagIndexRoomId
  const tagIndex = client.getRoom(tagIndexRoomId)

  // get a list of all the tag rooms from tag index
  const tagIndexChildren = await tagIndex.getHierarchy({ max_depth: 1 })

  // console.log("tagIndexChildren", tagIndexChildren)
  if (!tagIndexChildren || is(ErrorSchema, tagIndexChildren))
    return { errcode: "No tag rooms found" }

  // remove first item, which is the tag index room
  tagIndexChildren.shift()

  const tagMap = new Map()

  tagIndexChildren.forEach(tag => {
    tagMap.set(
      tag.canonical_alias?.split("#relay_tag_")[1].split(":")[0],
      tag.room_id
    )
  })

  // create a space for each ID,
  const idSpaces = await Promise.all(
    ids.map(async id => {
      const parentEvents = id.tags
        .map(tag => {
          const tagRoomId = tagMap.get(tag)
          if (!tagRoomId) return null
          return {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagRoomId,
          }
        })
        .filter(Boolean) as {
        type: string
        content: { via: string[] }
        state_key: string
      }[]

      const idSpace = await client.createRoom({
        name: id.name,
        creation_content: { type: "m.space" },
        topic: id.description,
        room_alias_name: `relay_id_${id.alias}`,
        initial_state: [
          {
            type: organSpaceType,
            content: {
              value: organSpaceTypeValue.page,
            },
          },
          {
            type: organPageType,
            content: {
              value: organRoomTypeTree.page.id,
            },
          },
          ...parentEvents,
        ],
      })

      if ("errcode" in idSpace) return idSpace

      // match each ID to the tag rooms and add them as children
      const parentResults = await Promise.all(
        id.tags.map(async tag => {
          const tagRoomId = tagMap.get(tag)
          if (!tagRoomId) return {}
          // console.log("tagRoomId", tagRoomId)
          const tagRoom = client.getRoom(tagRoomId)
          const parentResult = await tagRoom.sendStateEvent(
            "m.space.child",
            { via: [SERVER_NAME], order: id.alias },
            idSpace.roomId
          )
          // console.log("parentResult", parentResult)
          return { tag, parentResult }
        })
      )

      return { roomId: idSpace.roomId, parentResults }
    })
  )

  const idSpaceSuccessCount = idSpaces.filter(
    idSpace => !("errcode" in idSpace)
  ).length

  console.log("idSpaces success count", idSpaceSuccessCount)

  return {
    message: `${idSpaceSuccessCount} out of ${idSpaces.length} id spaces successfully created`,
  }
}
