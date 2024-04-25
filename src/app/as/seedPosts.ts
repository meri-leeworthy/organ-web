"use server"
import {
  organPostType,
  organRoomTypeTree,
  organRoomType,
  organRoomTypeValue,
} from "@/types/schema"
import { organPostMeta } from "@/types/post"
import posts from "./seed/posts.json"
import eventposts from "./seed/event-posts.json"
import { noCacheClient as client } from "@/lib/client"
import { getEventsMap, getTagsMap, getIdsMap } from "./getMaps"

const { SERVER_NAME } = process.env

export async function seedPosts() {
  // image mxc://synapse.local/FNdtUuJDojpzYEuVFZEAWlUl
  // would be good for half of the posts (per id) to be image posts
  const tagsMap = await getTagsMap()
  if ("errcode" in tagsMap) return tagsMap
  const idsMap = await getIdsMap()
  if ("errcode" in idsMap) return idsMap

  const eventsMap = await getEventsMap()
  console.log("continuing eventsMap", eventsMap)
  if (!eventsMap || "errcode" in eventsMap) return eventsMap

  const createEventsPostsResults = await Promise.all(
    eventposts.map(async post => {
      // console.log(post)
      const id = eventsMap.get(post.event)
      if (!id) return { errcode: "ID not found" }

      const timestamp = getTimestampWithinSixMonths()

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
              value: organRoomTypeTree.post.text,
            },
          },
          {
            type: organPostMeta,
            content: {
              body: post.text,
              author: {
                type: "id",
                value: id,
              },
              timestamp, // would be good to randomise this +/- 6months
            },
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: id,
          },
          // add 3 random tags
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagsMap.get(await getRandomTag(tagsMap)),
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagsMap.get(await getRandomTag(tagsMap)),
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagsMap.get(await getRandomTag(tagsMap)),
          },
        ],
      })

      if ("errcode" in postRoom) return postRoom

      // add the post as child to the id space
      const idSpace = client.getRoom(id)
      await idSpace.sendStateEvent(
        "m.space.child",
        { via: [SERVER_NAME], order: timestamp },
        postRoom.roomId
      )

      return postRoom.roomId
    })
  )

  const createEventsPostsSuccessCount = createEventsPostsResults.filter(
    result => typeof result === "string"
  ).length

  const createPostsResults = await Promise.all(
    posts.map(async post => {
      // console.log(post)
      const id = idsMap.get(post.id)
      if (!id) return { errcode: "ID not found" }

      const timestamp = getTimestampWithinSixMonths()

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
              value: organRoomTypeTree.post.text,
            },
          },
          {
            type: organPostMeta,
            content: {
              body: post.text,
              author: {
                type: "id",
                value: id,
              },
              timestamp,
            },
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: id,
          },
          // add 3 random tags
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagsMap.get(await getRandomTag(tagsMap)),
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagsMap.get(await getRandomTag(tagsMap)),
          },
          {
            type: "m.space.parent",
            content: {
              via: [SERVER_NAME],
            },
            state_key: tagsMap.get(await getRandomTag(tagsMap)),
          },
        ],
      })

      if ("errcode" in postRoom) return postRoom

      // add the post as child to the id space
      const idSpace = client.getRoom(id)
      await idSpace.sendStateEvent(
        "m.space.child",
        { via: [SERVER_NAME], order: timestamp },
        postRoom.roomId
      )

      return postRoom.roomId
    })
  )

  const createPostsSuccessCount = createPostsResults.filter(
    result => typeof result === "string"
  ).length

  return {
    message: `${createPostsSuccessCount} out of ${createPostsResults.length} post rooms and ${createEventsPostsSuccessCount} out of ${createEventsPostsResults.length} event post rooms successfully created`,
  }
}
export function getTimestampWithinSixMonths() {
  const yearTs = 365 * 24 * 60 * 60 * 1000
  const randomWithinSixMonths = Math.floor(Math.random() * yearTs) - yearTs / 2
  return Date.now() + randomWithinSixMonths
}

export async function getRandomTag(tagsMap: Map<string, string>) {
  const tagsArray = Array.from(tagsMap.keys())
  const randomIndex = Math.floor(Math.random() * tagsArray.length)
  return tagsArray[randomIndex]
}
