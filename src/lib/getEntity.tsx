import { client } from "@/lib/client"
import { props } from "@/lib/utils"
import {
  OrganEntityBase,
  OrganEntityBaseSchema,
  OrganEntitySchema,
  RoomTypesSchema,
  SubTypesSchema,
  organMeta,
  organType,
} from "@/types/schema"
import { is } from "simple-matrix-sdk"

// Show descriptive content from 'tag page' room
// fetch all children state here and pass it to the children
// define relevant state as simple objects and not classes

export async function getOrganEntity(
  roomId: string,
  alias?: string
): Promise<OrganEntityBase | undefined> {
  // console.log("roomId", roomId)
  const state = await client.getRoom(roomId).getState()
  if ("errcode" in state) {
    console.log("no state")
    console.log("state", state)
    return undefined
  }

  if (!alias) {
    const aliasEvent = state.get("m.room.canonical_alias")
    const maybeAlias = props(aliasEvent, "content", "alias")
    alias = typeof maybeAlias === "string" ? maybeAlias : undefined
  }

  const nameEvent = state.get("m.room.name")
  const name = props(nameEvent, "content", "name")

  const topicEvent = state.get("m.room.topic")
  const topic = props(topicEvent, "content", "topic")

  const entityTypeEvent = state.get(organType)
  const entityType = props(entityTypeEvent, "content", "type")
  const subType = props(entityTypeEvent, "content", "subtype")

  const metaEvent = state.get(organMeta)
  const meta = props(metaEvent, "content")

  const timestamp = state.get("m.room.create")?.origin_server_ts

  const entity = {
    roomId,
    alias,
    name,
    topic,
    entityType,
    subType,
    meta,
    timestamp,
  }

  OrganEntityBaseSchema.parse(entity)
  if (!is(RoomTypesSchema, entityType)) return undefined
  if (!is(SubTypesSchema(entityType), subType)) return undefined

  if (is(OrganEntitySchema(entityType, subType), entity)) {
    return entity
  }
  return undefined
}
