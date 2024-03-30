"use server"

import {
  Client,
  ClientEventOutput,
  CreateRoomOpts,
  Room,
} from "simple-matrix-sdk"
import { RoomDebug } from "./Forms"
import { joinRoom } from "../api/join/action"
import { noCacheFetch } from "@/lib/utils"
import {
  organPageEventMeta,
  organPageType,
  organPageTypeValue,
  organPostMeta,
  organPostType,
  organPostTypeValue,
  organRoomType,
  organRoomTypeValue,
  organSpaceType,
  organSpaceTypeValue,
} from "@/lib/types"
import tags from "./seed/tags.json"
import ids from "./seed/ids.json"
import events from "./seed/events.json"
import posts from "./seed/posts.json"

const { MATRIX_BASE_URL, AS_TOKEN, SERVER_NAME } = process.env

const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
  fetch: noCacheFetch,
  params: { user_id: "@_relay_bot:" + SERVER_NAME },
})

export async function register(user: string) {
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
  })
  const register = await client.post("register", {
    type: "m.login.application_service",
    username: `_relay_${user}`,
  })
  console.log(register)
  return register
}

export async function joinRoomAction(formData: FormData) {
  const room = formData.get("room") as string
  const user = (formData.get("user") as string) || "bot"
  return joinRoom(room, user)
}

export async function createRoom(formData: FormData) {
  const name = formData.get("name") as string
  const space = formData.get("space") as string

  console.log("space", space)

  const opts: CreateRoomOpts = {
    name,
  }

  if (space === "true") {
    opts["creation_content"] = { type: "m.space" }
  }
  const room = await client.createRoom(opts)
  console.log("room", room)
  if ("errcode" in room) return room
  return { roomId: room.roomId }
}

export async function getRooms(formData: FormData): Promise<RoomDebug[]> {
  const user = formData.get("user") as string
  const client = new Client(MATRIX_BASE_URL!, AS_TOKEN!, {
    fetch: noCacheFetch,
    params: { user_id: `@_relay_${user}:${SERVER_NAME}` },
  })
  const { joined_rooms: roomIds } = await client.get("joined_rooms", {
    user_id: `@_relay_${user}:${SERVER_NAME}`,
  })

  console.log("roomIds", roomIds)

  const rooms = roomIds?.map((roomId: string) => {
    const room = new Room(roomId, client)
    return room
  })
  console.log("rooms", rooms, "user", user)
  const roomsWithData: RoomDebug[] = await Promise.all(
    rooms?.map(async (room: Room) => {
      const roomData = await room.getHierarchy()
      // console.log("roomData", roomData)
      return roomData
    })
  )
  console.log("roomsWithData", roomsWithData)
  return roomsWithData
}

export async function getSpaceChildren(formData: FormData) {
  const space = formData.get("space") as string
  const children = await client.get(`rooms/${space}/children`)
  console.log("children", children)
  return children
}

export async function getStateAction(formData: FormData) {
  const roomId = formData.get("room") as string
  const room = new Room(roomId, client)
  const state = await room.getState()
  console.log("state", state)
  return state
}

export async function getStateTypeAction(formData: FormData) {
  const roomId = formData.get("room") as string
  const stateType = formData.get("stateType") as string
  console.log("stateType", stateType)
  const room = new Room(roomId, client)
  const state = await room.getStateEvent(stateType)
  console.log("state", state)
  return state
}

export async function setStateAction(formData: FormData) {
  const roomId = formData.get("room") as string
  const stateType = formData.get("stateType") as string
  const stateKey = formData.get("stateKey") as string
  const content = formData.get("content") as string
  const room = new Room(roomId, client)
  const state = await room.sendStateEvent(
    stateType,
    { type: content },
    stateKey
  )
  console.log("state", state)
  return state
}

export async function sendMessage(formData: FormData) {
  const roomId = formData.get("room") as string
  const message = formData.get("message") as string
  const room = new Room(roomId, client)
  return await room.sendMessage({ msgtype: "m.text", body: message })
}

export async function getAliases(formData: FormData) {
  const roomId = formData.get("room") as string
  const room = client.getRoom(roomId)
  const aliases = await room.getAliases()
  console.log("aliases", aliases)
  return aliases
}

export async function getRoomIdFromAlias(formData: FormData) {
  const alias = formData.get("alias") as string
  const roomId = await client.getRoomIdFromAlias(alias)
  console.log("roomId", roomId)
  return roomId
}

export async function setAlias(formData: FormData) {
  const roomId = formData.get("room") as string
  const alias = formData.get("alias") as string
  return await client.getRoom(roomId).setAlias(alias)
}

export async function createTagIndexSpace() {
  const space = await client.createRoom({
    name: "Tag Index",
    creation_content: { type: "m.space" },
    room_alias_name: "relay_tagindex",
    initial_state: [
      {
        type: organSpaceType,
        content: {
          value: organSpaceTypeValue.index,
        },
      },
    ],
  })
  console.log("space", space)
  if ("errcode" in space) {
    const roomId = await client.getRoomIdFromAlias(
      "#relay_tagindex:" + SERVER_NAME
    )
    console.log("roomId", roomId)
    return { message: "Tag Index already created", roomId }
  }
  return { message: "Tag Index created", roomId: space.roomId }
}

export async function unsetTagIndexSpace() {
  const roomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )
  console.log("roomId", roomId)
  if (typeof roomId === "object" && "errcode" in roomId) return roomId
  return await client
    .getRoom(roomId)
    .deleteAlias("#relay_tagindex:" + SERVER_NAME)
}

export async function seedTags() {
  const tagIndexRoomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )
  if (typeof tagIndexRoomId === "object" && "errcode" in tagIndexRoomId)
    return tagIndexRoomId
  const tagIndex = client.getRoom(tagIndexRoomId)

  // console.log("Tags", tags)
  const results = await Promise.all(
    Object.entries(tags).map(async ([tag, tagMeta]) => {
      const existingTagSpace = await client.getRoomIdFromAlias(
        "#relay_tag_" + tag + ":" + SERVER_NAME
      )

      // console.log("existingTagSpace", existingTagSpace)

      const tagSpace =
        typeof existingTagSpace === "string"
          ? client.getRoom(existingTagSpace)
          : await client.createRoom({
              creation_content: { type: "m.space" },
              room_alias_name: `relay_tag_${tag}`,
              name: tagMeta.name,
              topic: tagMeta.description,
              initial_state: [
                {
                  type: organSpaceType,
                  content: {
                    value: organSpaceTypeValue.tag,
                  },
                },
                {
                  type: "m.space.parent",
                  content: {
                    via: [SERVER_NAME],
                  },
                  state_key: tagIndexRoomId,
                },
              ],
            })
      // console.log("space", tagSpace)
      if ("errcode" in tagSpace) return tagSpace

      const parentResult = await tagIndex.sendStateEvent(
        "m.space.child",
        { via: [SERVER_NAME] },
        tagSpace.roomId
      )

      return { roomId: tagSpace.roomId, tag, parentResult }
    })
  )
  const tagsResultsSuccessCount = results.filter(
    result => !("errcode" in result)
  ).length

  return {
    message: `${tagsResultsSuccessCount} out of ${results.length} tag spaces successfully created`,
  }
}

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

  if (!tagIndexChildren) return { errcode: "No tag rooms found" }

  // remove first item, which is the tag index room
  tagIndexChildren.shift()

  const tagMap = new Map()

  tagIndexChildren.forEach(tag => {
    tagMap.set(
      tag.canonical_alias.split("#relay_tag_")[1].split(":")[0],
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
              value: organPageTypeValue.id,
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
            { via: [SERVER_NAME] },
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

function normalizeName(name: string): string {
  // Convert to lowercase
  let normalized = name.toLowerCase()

  // Remove punctuation
  normalized = normalized.replace(/[^\w\s]/g, "")

  // Replace spaces with hyphens
  normalized = normalized.replace(/\s+/g, "-")

  return normalized
}

export async function seedEvents() {
  const tagsMap = await getTagsMap()
  if ("errcode" in tagsMap) return tagsMap
  const idsMap = await getIdsMap()
  if ("errcode" in idsMap) return idsMap

  // create event spaces
  const createEventsResults = await Promise.all(
    events.map(async event => {
      // console.log(event)
      // get room IDs for hosts and tags
      const hostIds = event.hosts.map((host: string) => {
        const normalisedName = normalizeName(host)
        return idsMap.get(normalisedName)
      })
      const tagIds = event.tags.map((tag: string) => {
        return tagsMap.get(tag)
      })
      // console.log("hostIds", hostIds)
      // console.log("tagIds", tagIds)

      const parentEventsHosts = hostIds.map(hostId => {
        return {
          type: "m.space.parent",
          content: {
            via: [SERVER_NAME],
          },
          state_key: hostId,
        }
      })

      const parentEventsTags = tagIds.map(tagId => {
        return {
          type: "m.space.parent",
          content: {
            via: [SERVER_NAME],
          },
          state_key: tagId,
        }
      })

      const eventTime = new Date(generateRandomTimestamp())

      // create event space
      const eventSpace = await client.createRoom({
        name: event.name,
        creation_content: { type: "m.space" },
        topic: event.description,
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
              value: organPageTypeValue.event,
            },
          },
          {
            type: organPageEventMeta,
            content: {
              start: eventTime.toISOString(),
              end: eventTime.toISOString(),
              location: {
                type: "text",
                value: event.location,
              },
            },
          },
          ...parentEventsHosts,
          ...parentEventsTags,
        ],
      })

      if ("errcode" in eventSpace) return eventSpace

      // add event space to host and tag spaces
      hostIds.forEach(async hostId => {
        if (!hostId) return
        const hostRoom = client.getRoom(hostId)
        await hostRoom.sendStateEvent(
          "m.space.child",
          { via: [SERVER_NAME] },
          eventSpace.roomId
        )
      })

      tagIds.forEach(async tagId => {
        if (!tagId) return
        const tagRoom = client.getRoom(tagId)
        await tagRoom.sendStateEvent(
          "m.space.child",
          { via: [SERVER_NAME] },
          eventSpace.roomId
        )
      })

      return eventSpace.roomId
    })
  )

  const createEventsSuccessCount = createEventsResults.filter(
    result => typeof result === "string"
  ).length

  return {
    message: `${createEventsSuccessCount} out of ${createEventsResults.length} event spaces successfully created`,
  }
}

function generateRandomTimestamp(): number {
  const currentTimestamp = Math.floor(Date.now() / 1000) // Current UNIX timestamp in seconds
  const threeMonthsInSeconds = 90 * 24 * 60 * 60 // 90 days in seconds
  const randomOffset =
    Math.floor(Math.random() * (2 * threeMonthsInSeconds + 1)) -
    threeMonthsInSeconds // Random offset within 3 months
  const randomTimestamp = currentTimestamp + randomOffset // Add random offset to current timestamp
  const roundedTimestamp = Math.round(randomTimestamp / (5 * 60)) * (5 * 60) // Round to nearest 5-minute interval
  return roundedTimestamp
}

export async function seedPosts() {
  // const tagsMap = await getTagsMap()
  // if ("errcode" in tagsMap) return tagsMap
  const idsMap = await getIdsMap()
  if ("errcode" in idsMap) return idsMap

  const createPostsResults = await Promise.all(
    posts.map(async post => {
      // console.log(post)
      const id = idsMap.get(post.id)
      if (!id) return { errcode: "ID not found" }

      const postRoom = await client.createRoom({
        topic: post.text,
        initial_state: [
          {
            type: organRoomType,
            content: {
              value: organRoomTypeValue.post,
            },
          },
          {
            type: organPostType,
            content: {
              value: organPostTypeValue.text,
            },
          },
          {
            type: organPostMeta,
            content: {
              body: post.text,
              author: {
                type: "id",
                value: id,
                timestamp: Date.now(),
              },
            },
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: id,
          },
        ],
      })

      if ("errcode" in postRoom) return postRoom

      // add the post as child to the id space

      const idSpace = client.getRoom(id)
      await idSpace.sendStateEvent(
        "m.space.child",
        { via: [SERVER_NAME], order: Date.now() },
        postRoom.roomId
      )

      return postRoom.roomId
    })
  )

  const createPostsSuccessCount = createPostsResults.filter(
    result => typeof result === "string"
  ).length

  return {
    message: `${createPostsSuccessCount} out of ${createPostsResults.length} post rooms successfully created`,
  }
}

async function getIdsMap() {
  // get a list of all the ID spaces
  // this is done by searching each tag in the tag-index and making a map
  // i.e. if a page doesn't have a tag it's not discoverable

  const tagIndexChildren = await getTagIndexChildren()
  if ("errcode" in tagIndexChildren) return tagIndexChildren

  // create a set of ID Page room IDs
  const idsSet = new Set<string>()
  tagIndexChildren.forEach(tag => {
    tag.children_state.forEach((id: ClientEventOutput) => {
      idsSet.add(id.state_key!)
    })
  })
  // get the canonical alias for each ID Page and map to roomID
  const idsMap = new Map<string, string>()
  for (const id of idsSet) {
    const idSpace = client.getRoom(id)

    const aliasResponse = await idSpace.getCanonicalAlias()

    if ("errcode" in aliasResponse) continue

    const alias = aliasResponse.alias.split("#relay_id_")[1].split(":")[0]

    // console.log("idSpace", idSpace.roomId)
    // console.log("canonical alias", alias)

    idsMap.set(alias, idSpace.roomId)
  }

  return idsMap
}

async function getTagsMap() {
  const tagIndexChildren = await getTagIndexChildren()
  if ("errcode" in tagIndexChildren) return tagIndexChildren

  // get the canonical alias for each tag and map to roomID
  const tagsMap = new Map<string, string>()
  tagIndexChildren.forEach(tag => {
    tagsMap.set(
      tag.canonical_alias.split("#relay_tag_")[1].split(":")[0],
      tag.room_id
    )
  })

  return tagsMap
}

async function getTagIndexChildren() {
  const tagIndexRoomId = await client.getRoomIdFromAlias(
    "#relay_tagindex:" + SERVER_NAME
  )
  if (typeof tagIndexRoomId === "object" && "errcode" in tagIndexRoomId)
    return tagIndexRoomId
  const tagIndex = client.getRoom(tagIndexRoomId)

  // get a list of all the tag rooms from tag index
  const tagIndexChildren = await tagIndex.getHierarchy({ max_depth: 1 })

  if (!tagIndexChildren) return { errcode: "No tag rooms found" }
  // console.log("tagIndexChildren", tagIndexChildren)

  // remove tag index room
  tagIndexChildren.shift()

  return tagIndexChildren
}
