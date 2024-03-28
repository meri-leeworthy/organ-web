import { type ClassValue, clsx } from "clsx"
import { State } from "simple-matrix-sdk"
import { twMerge } from "tailwind-merge"
import { RoomTypes, SubTypes, organSpaceTypeValue } from "./types"

const { MATRIX_BASE_URL } = process.env

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const noCacheFetch = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, { ...init, cache: "no-store" })

export const getCacheTagFetch =
  (tags: string[], revalidate: number) =>
  (input: RequestInfo, init?: RequestInit) =>
    fetch(input, {
      ...init,
      next: {
        revalidate,
        tags,
      },
    })

export async function getMessagesChunk(messagesIterator: AsyncGenerator) {
  const { value } = await messagesIterator.next()
  return value?.chunk
}

// export function parseContactKVs(
//   messages: Event[]
// ): Record<string, string | undefined> {
//   const contactMetaMsgs = messages
//     .filter(message => message.content?.body?.includes("CONTACT\n"))
//     .map(message => message.content?.body)
//   const initialObject: Record<string, string | undefined> = {}
//   return contactMetaMsgs
//     .map(message =>
//       message
//         ?.split("\n")
//         .slice(1)
//         .flatMap((line: string) => line.split(": ", 2))
//     )
//     .reduce((object, tuple) => {
//       if (!tuple) return object
//       const [key, value] = tuple
//       object[key.toLowerCase()] = value
//       return object
//     }, initialObject)
// }

// export function parseFaqKVs(
//   messages: Event[]
// ): Record<string, string | undefined> {
//   const faqMetaMsgs = messages
//     .filter(message => message.content?.body?.includes("FAQ: "))
//     .map(message => message.content?.body)
//   const initialObject: Record<string, string | undefined> = {}
//   return faqMetaMsgs
//     .map(message => message?.split("FAQ: ").slice(1, 2)[0].split("\n"))
//     .reduce((object, tuple) => {
//       if (!tuple) return object
//       const [key, ...values] = tuple
//       object[key] = values.join("\n")
//       return object
//     }, initialObject)
// }

// export function replaceEditedMessages(messages: Event[]) {
//   const editedMessages = messages.filter(
//     message => message?.content && "m.new_content" in message.content
//   )

//   const editedMessageIds = editedMessages.map(
//     message =>
//       message?.content &&
//       "m.relates_to" in message.content &&
//       message.content["m.relates_to"].event_id
//   )

//   const originalMessages = messages.filter(message =>
//     editedMessageIds.includes(message.event_id)
//   )

//   const newMessages = messages.filter(
//     message => !editedMessageIds.includes(message.event_id)
//   )

//   const originalMessagesWithEditedBodies = originalMessages.map(message => {
//     const thisEditedMessage = editedMessages.find(
//       editedMessage =>
//         editedMessage?.content &&
//         "m.relates_to" in editedMessage.content &&
//         editedMessage.content["m.relates_to"].event_id === message.event_id
//     )
//     const editedBody =
//       thisEditedMessage?.content && thisEditedMessage.content.body
//     // "m.new_content" in thisEditedMessage.content &&
//     // thisEditedMessage.content["m.new_content"].body
//     return { ...message, content: { ...message.content, body: editedBody } }
//   })
//   return [...newMessages, ...originalMessagesWithEditedBodies]
// }

function doubleDigit(number: number) {
  return number < 10 ? `0${number}` : number
}

export function getContextualDate(ts: number) {
  const date = new Date(ts)

  const dateString = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
  const timeString = new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "numeric",
  }).format(date)

  const now = new Date()
  // const testDate = new Date("2024-01-16T00:00:00.000Z")
  // const now = testDate

  // 2nd January 2024
  // 14th November
  // Wednesday 22nd October
  // next Monday
  // this Thursday
  // Tomorrow
  // Today, 2:30pm
  // Yesterday
  // 2-6 days ago
  // last Tuesday
  // 2-4 weeks ago
  // last month
  // 2-11 months ago
  // 30 December last year
  // 2+ years ago

  const isDateThisYear = date.getFullYear() === now.getFullYear()

  if (!isDateThisYear) {
    const diff = date.getFullYear() - now.getFullYear()
    return diff < -1
      ? `${-diff} years ago`
      : diff === -1
      ? `${date.toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
        })} last year`
      : `${
          // for future years just show the full date
          (date.toLocaleDateString("en-AU"),
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        }`
  }

  const isDateThisMonth = date.getMonth() === now.getMonth()

  if (!isDateThisMonth) {
    const diff = date.getMonth() - now.getMonth()
    return diff < -1
      ? `${-diff} months ago`
      : diff === -1
      ? `${date.toLocaleDateString("en-AU", {
          day: "numeric",
          month: "long",
        })} last month`
      : `${date.toLocaleDateString("en-AU", {
          //for future months this year, show the date without the year
          day: "numeric",
          month: "long",
        })}`
  }

  const dateDiff = now.getDate() - date.getDate()

  if (dateDiff === 0) {
    return `Today, ${timeString}`
  }

  if (dateDiff === -1) {
    return `Tomorrow, ${timeString}`
  }

  if (dateDiff === 1) {
    return `Yesterday, ${timeString}`
  }

  const mostRecentMonday =
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
  const nextMonday = mostRecentMonday + 7

  const isDateWithinNextWeek =
    date.getDate() >= nextMonday && date.getDate() < nextMonday + 7

  if (isDateWithinNextWeek) {
    return `Next ${new Intl.DateTimeFormat("en-AU", { weekday: "long" }).format(
      date
    )}, ${timeString}`
  }

  const isDateWithinThisWeek = date.getDate() >= mostRecentMonday

  if (isDateWithinThisWeek && date.getDate() > now.getDate()) {
    return `This ${new Intl.DateTimeFormat("en-AU", { weekday: "long" }).format(
      date
    )}, ${timeString}`
  }

  // "x days ago" only relevant if it's wednesday or later
  // i.e. day = 1 or 2 -> skip and go to 'last week' / '2-4 weeks ago'

  if (isDateWithinThisWeek && now.getDay() !== 1 && now.getDay() !== 2) {
    return `${dateDiff} days ago`
  }

  const isDateWithinLastWeek =
    date.getDate() >= mostRecentMonday - 7 && date.getDate() < mostRecentMonday

  if (isDateWithinLastWeek) {
    return `Last ${new Intl.DateTimeFormat("en-AU", { weekday: "long" }).format(
      date
    )}, ${timeString}`
  }

  const isDateBeforeLastWeek = date.getDate() < mostRecentMonday - 7

  if (isDateBeforeLastWeek) {
    return `${date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "long",
    })}`
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "full",
  }).format(date)
}

export function getMxcUrl(mxc: string) {
  // console.log("mxc", mxc)
  if (!mxc) return ""
  if (!mxc.includes("mxc://")) return mxc
  const serverName = mxc.split("://")[1].split("/")[0]
  const mediaId = mxc.split("://")[1].split("/")[1]

  return `${MATRIX_BASE_URL}/_matrix/media/r0/download/${serverName}/${mediaId}`
}

export function xor(a: boolean, b: boolean) {
  return (a || b) && !(a && b)
}

export function slug(roomId: string) {
  if (!roomId || !roomId.includes(":") || !roomId.includes("!")) return roomId
  return roomId.split(":")[0].split("!")[1]
}

export function getIdLocalPart(id: string) {
  return id.split(":")[0].slice(1)
}

export function toXX(s: number) {
  return s < 10 ? `0${s}` : s
}

export function toValidDateTimeString(date: Date) {
  return `${toValidDateString(date)}T${toValidTimeString(date)}`
}

export function toValidTimeString(date: Date) {
  return `${toXX(date.getHours())}:${toXX(date.getMinutes())}`
}

export function toValidDateString(date: Date) {
  return `${date.getFullYear()}-${toXX(date.getMonth() + 1)}-${toXX(
    date.getDate()
  )}`
}

export function props(maybeObject: unknown, ...properties: string[]): unknown {
  // Base case: If no properties are left to access or if the object is not an object,
  // return the current object (which could be undefined if not found)
  if (
    properties.length === 0 ||
    !maybeObject ||
    typeof maybeObject !== "object"
  ) {
    return maybeObject
  }

  // Take the first property from the list to access
  const [firstProperty, ...remainingProperties] = properties

  // Check if the property exists in the object, if not return undefined
  if (!(firstProperty in maybeObject)) {
    return undefined
  }

  // Recurse with the value of the accessed property and the remaining properties
  return props((maybeObject as any)[firstProperty], ...remainingProperties)
}

export function str(maybeString: unknown): string {
  if (!maybeString || typeof maybeString !== "string") return ""
  return maybeString
}

export function normaliseTagString(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
}

export function isOrganRoomType<T extends RoomTypes>(
  state: State,
  type: T,
  subType?: SubTypes<T>
) {
  const roomTypeEvent =
    type === "post"
      ? state.get("organ.room.type")
      : state.get("organ.space.type")
  if (!roomTypeEvent) return false

  const roomType = props(roomTypeEvent, "content", "value")
  if (roomType !== type) return false

  if (subType) {
    const subTypeEvent = state.get(`organ.${type}.type`)
    if (!subTypeEvent) return false

    const subTypeValue = props(subTypeEvent, "content", "value")
    if (subTypeValue !== subType) return false
  }

  return true
}
