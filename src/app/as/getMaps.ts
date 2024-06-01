"use server"

import { ClientEventOutput, ErrorSchema, is } from "simple-matrix-sdk"
import { noCacheClient as client, getTagIndex } from "@/lib/client"
import { props } from "@/lib/utils"
import { organRoomTypeTree } from "@/types/schema"

const { SERVER_NAME } = process.env

export async function getTagIndexChildren() {
  const tagIndex = await getTagIndex(client)
  if ("errcode" in tagIndex) return tagIndex

  // get a list of all the tag rooms from tag index
  const tagIndexChildren = await tagIndex.getHierarchy({ max_depth: 1 })

  if (!tagIndexChildren || is(ErrorSchema, tagIndexChildren))
    return { errcode: "No tag rooms found" }
  // console.log("tagIndexChildren", tagIndexChildren)
  // remove tag index room
  tagIndexChildren.shift()

  return tagIndexChildren
}

export async function getTagsMap() {
  const tagIndexChildren = await getTagIndexChildren()
  if (is(ErrorSchema, tagIndexChildren)) return tagIndexChildren

  // get the canonical alias for each tag and map to roomID
  const tagsMap = new Map<string, string>()
  tagIndexChildren.forEach(tag => {
    if (typeof tag.canonical_alias === "string")
      tagsMap.set(
        tag.canonical_alias.split("#relay_tag_")[1].split(":")[0],
        tag.room_id
      )
  })

  return tagsMap
}

export async function getIdsMap() {
  // get a list of all the ID spaces
  // this is done by searching each tag in the tag-index and making a map
  // i.e. if a page doesn't have a tag it's not discoverable
  const tagIndexChildren = await getTagIndexChildren()
  if (is(ErrorSchema, tagIndexChildren)) return tagIndexChildren

  // create a set of ID Page room IDs
  const idsSet = new Set<string>()
  tagIndexChildren.forEach(tag => {
    tag.children_state.forEach(id => {
      idsSet.add(id.state_key)
    })
  })

  // get the canonical alias for each ID Page and map to roomID
  const idsMap = new Map<string, string>()
  idsSet.forEach(async id => {
    const idSpace = client.getRoom(id)
    const aliasResponse = await idSpace.getCanonicalAlias()
    if ("errcode" in aliasResponse) return
    const alias = aliasResponse.alias.split("#relay_id_")[1].split(":")[0]
    idsMap.set(alias, idSpace.roomId)
  })

  return idsMap
}

export async function getEventsMap() {
  const tagIndexChildren = await getTagIndexChildren()
  if ("errcode" in tagIndexChildren) return tagIndexChildren

  const tagIds = tagIndexChildren.map(tag => tag.room_id)

  console.log("tagIds", tagIds)

  // create a set of event room IDs
  const tagChildrenSet = new Set<string>()
  await Promise.all(
    tagIds.map(async tag => {
      const tagSpace = client.getRoom(tag)

      const tagChildren = await tagSpace.getHierarchy({ max_depth: 1 })
      if (is(ErrorSchema, tagChildren)) return
      console.log("tagChildren lenght", tagChildren?.length)
      tagChildren?.shift()

      tagChildren?.forEach(tagChild => {
        // console.log("tagChildren", tagChild.children_state)
        tagChild.children_state.forEach(event => {
          tagChildrenSet.add(event.state_key)
        })
      })
    })
  )

  // get the canonical alias for each event and map to roomID
  const eventsMap = new Map<string, string>()

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  for (const tagChild of tagChildrenSet) {
    await delay(10) // rate limit
    const childSpace = client.getRoom(tagChild)
    try {
      const childState = await childSpace.getState()
      if (!childState || "errcode" in childState) continue
      const typeEvent = childState.get("organ.page.type")
      const type = props(typeEvent, "content", "value")
      if (type !== organRoomTypeTree.event) continue
      const nameEvent = childState.get("m.room.name")
      const name = props(nameEvent, "content", "name")
      if (!name) continue
      eventsMap.set(name as string, childSpace.roomId)
    } catch (e) {
      console.log("error with tagChild: ", tagChild)
      console.error(e)
    }
  }

  console.log("eventsMap", eventsMap)

  return eventsMap
}
