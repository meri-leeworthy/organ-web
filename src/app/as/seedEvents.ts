"use server"
import {
  organPageType,
  organRoomTypeTree,
  organSpaceType,
  organSpaceTypeValue,
} from "@/types/schema"
import { organPageEventMeta } from "@/types/event"
import events from "./seed/events.json"
import { getIdsMap } from "./getMaps"
import { getTagsMap } from "./getMaps"
import { noCacheClient as client } from "@/lib/client"

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
              value: organRoomTypeTree.page.event,
            },
          },
          {
            type: organPageEventMeta,
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
export function normalizeName(name: string): string {
  // Convert to lowercase
  let normalized = name.toLowerCase()

  // Remove punctuation
  normalized = normalized.replace(/[^\w\s]/g, "")

  // Replace spaces with hyphens
  normalized = normalized.replace(/\s+/g, "-")

  return normalized
}

export function generateRandomTimestamp(): number {
  const currentTimestamp = Date.now() // Current timestamp in millisecondsseconds
  const threeMonthsInMilliseconds = 90 * 24 * 60 * 60 * 1000 // 90 days in seconds
  const randomOffset =
    Math.floor(Math.random() * (2 * threeMonthsInMilliseconds + 1)) -
    threeMonthsInMilliseconds // Random offset within 3 months
  const randomTimestamp = currentTimestamp + randomOffset // Add random offset to current timestamp
  const roundedTimestamp =
    Math.round(randomTimestamp / (5 * 60 * 1000)) * (5 * 60 * 1000) // Round to nearest 5-minute interval
  return roundedTimestamp
}
