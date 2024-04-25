"use server"
import { organSpaceType, organSpaceTypeValue } from "@/types/schema"
import tags from "./seed/tags.json"
import { noCacheClient as client } from "@/lib/client"

const { SERVER_NAME } = process.env

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
        { via: [SERVER_NAME], order: tag },
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
