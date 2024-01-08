/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { useClient } from "@/lib/useClient"
import { Room } from "simple-matrix-sdk"
import { IconCalendarEvent } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { OrganCalEventUnstableSchema, organCalEventUnstable } from "@/lib/types"
import { is } from "valibot"
import {
  Description,
  PostTypeButton,
  UploadAvatar,
  UploadImageButton,
} from "@/components/ui"
import { Button, Input } from "@/components/styled"
import { getMxcUrl, toValidDateString } from "@/lib/utils"

export default function EditEventPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  //TODO: this is a copy of EditPostPage needs changing (and refactor to share code?)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [host, setHost] = useState({})
  const [place, setPlace] = useState("")
  const [startDate, setStartDate] = useState(toValidDateString(new Date()))
  const [startTime, setStartTime] = useState("00:00")
  const [endDate, setEndDate] = useState(toValidDateString(new Date()))
  const [endTime, setEndTime] = useState("00:00")
  const [allDay, setAllDay] = useState(false)
  const [avatar, setAvatar] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const client = useClient()

  const room = client
    ? new Room(`!${params.slug}:radical.directory`, client)
    : undefined

  useEffect(() => {
    room?.getEvent(`$${params.id}`).then(post => {
      if (!post) setError("Event not found")
      if (post.type !== "m.room.message") setError("Event not valid")
      if (!is(OrganCalEventUnstableSchema, post.content)) {
        setError("Event not valid")
        return
      }
      setTitle(post.content?.title || "")
      setContent(post.content?.body || "")
      setHost(post.content?.host || {})
      setPlace(post.content?.location || "")
      setStartDate(post.content?.start.split("T")[0] || "")
      setStartTime(post.content?.start.split("T")[1] || "")
      setEndDate(post.content?.end?.split("T")[0] || "")
      setEndTime(post.content?.end?.split("T")[1] || "")
      setAllDay(post.content?.allDay || false)
      setAvatar(post.content?.avatar || "")
    })
  }, [client])

  if (!client) return "loading..."
  if (error) return `error! ${error} :(`

  async function handlePostSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log("id", params.id)
    event.preventDefault()
    setIsLoading(true)
    const messageEvent = {
      msgtype: organCalEventUnstable,
      title,
      body: content,
      host,
      location: place,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      allDay,
      avatar,
      tags: [],
      "m.new_content": {
        body: content,
        msgtype: organCalEventUnstable,
        title,
        host,
        location: place,
        start: `${startDate}T${startTime}`,
        end: `${endDate}T${endTime}`,
        allDay,
        avatar,
        tags: [],
      },
      "m.relates_to": {
        rel_type: "m.replace",
        event_id: `$${params.id}`,
      },
    }
    const newPostId = await room?.sendMessage(messageEvent)
    // console.log("newPostId", newPostId)
    setIsLoading(false)
    router.push(`/id/${params.slug}/post/${newPostId?.event_id}`)
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
  }

  const handler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const result = file && (await client?.uploadFile(file))
      console.log("result", result)
      setAvatar(getMxcUrl(result.content_uri))
    }
  }

  return (
    <div className="mt-3 p-1 bg-[#fff3] flex flex-col w-full">
      <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
        {avatar ? (
          <div className="relative flex items-end mx-auto">
            <img src={avatar} alt="avatar" width="250" />
            <UploadAvatar slug={params.slug} handler={handler} edit />
          </div>
        ) : (
          // <div className="flex items-center justify-center grow">
          //   <img src={avatar} alt="post" key={avatar} className="h-72" />
          // </div>
          <UploadAvatar slug={params.slug} handler={handler} />
        )}

        <div className="flex gap-1">
          <PostTypeButton type="event" thisType="event" setType={() => {}}>
            <IconCalendarEvent size={16} /> Event
          </PostTypeButton>
          <Input
            type="text"
            id="title"
            placeholder="Title"
            aria-label="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <Description
          type="event"
          content={content}
          setContent={setContent}
          rows={20}
        />
        {/* <div className="flex flex-col">
          <textarea
            id="content"
            aria-label="content"
            placeholder="Content"
            value={content}
            // rows={content.split("\n").length + 1}
            onChange={handleContentChange}
            className={`w-full px-1 text-base placeholder:text-black placeholder:opacity-30 bg-transparent border border-[#1D170C1a] rounded h-[78vh] ${
              isLoading && "opacity-50"
            }`}
          />
        </div> */}
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            id="location"
            placeholder="Location"
            aria-label="location"
            value={place}
            onChange={e => setPlace((e.target as HTMLInputElement).value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e =>
                setStartDate(toValidDateString(new Date(e.target.value)))
              }
              className="font-medium px-1 text-[#8258ff] bg-transparent text-opacity-50 border border-primary focus:outline-dashed focus:outline-1 focus:outline-primary"
            />
            {!allDay && (
              <input
                type="time"
                value={startTime}
                onChange={e => {
                  console.log("e", e)
                  setStartTime(e.currentTarget.value)
                }}
                step="300"
                className="font-medium px-1 text-[#8258ff] bg-transparent text-opacity-50 border border-primary focus:outline-dashed focus:outline-1 focus:outline-primary"
              />
            )}

            <label className="flex items-center gap-2 text-xs uppercase opacity-80">
              All Day?
              <input
                type="checkbox"
                id="allday"
                name="allday"
                checked={allDay}
                onChange={e => setAllDay(e.target.checked)}
                className="mr-1 outline-4 outline-primary checked:bg-primary"
              />
            </label>
            <div className="flex items-center justify-end gap-2 ml-auto">
              {!avatar && (
                <UploadImageButton
                  imageSrcs={avatar}
                  setImageSrcs={setAvatar}
                />
              )}
              <Button
                type="submit"
                className={`rounded-[100%] border border-black border-opacity-40 text-sm px-2 py-1 gap-1 self-end flex items-center ${
                  isLoading && "opacity-50"
                }`}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
      {/* <NewPost slug={slug} /> */}
    </div>
  )
}
