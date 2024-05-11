"use server"
import {
  organPageType,
  organRoomTypeTree,
  organSpaceType,
  organSpaceTypeValue,
} from "@/types/schema"
import { organCalEventMeta } from "@/types/event"
import events from "./seed/events.json"
import { getIdsMap } from "./getMaps"
import { getTagsMap } from "./getMaps"
import { noCacheClient as client } from "@/lib/client"
import { normalizeName, generateRandomTimestamp } from "./utils"

const { SERVER_NAME } = process.env

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
              value: organRoomTypeTree.event,
            },
          },
          {
            type: organCalEventMeta,
            content: {
              start: `${eventTime.valueOf()}`,
              end: `${eventTime.valueOf() + 1000 * 60 * 60 * 2}`,
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
          { via: [SERVER_NAME], order: `${eventTime.valueOf()}` },
          eventSpace.roomId
        )
      })

      tagIds.forEach(async tagId => {
        if (!tagId) return
        const tagRoom = client.getRoom(tagId)
        await tagRoom.sendStateEvent(
          "m.space.child",
          { via: [SERVER_NAME], order: `${eventTime.valueOf()}` },
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
