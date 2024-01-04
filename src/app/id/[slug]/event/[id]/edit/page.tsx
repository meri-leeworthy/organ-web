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
  UploadOrShowAvatar,
} from "@/components/ui"
import { Input } from "@/components/styled"
import { getMxcUrl } from "@/lib/utils"

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
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
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
      setStart(post.content?.start || "")
      setEnd(post.content?.end || "")
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
      start,
      end,
      allDay,
      avatar,
      tags: [],
      "m.new_content": {
        body: content,
        msgtype: organCalEventUnstable,
        title,
        host,
        location: place,
        start,
        end,
        allDay,
        avatar,
        tags: [],
      },
      "m.relates_to": {
        rel_type: "m.replace",
        event_id: `$${params.id}`,
      },
    }
    //this should EDIT the post, not create a new one
    await room?.sendMessage(messageEvent)
    setIsLoading(false)
    router.push(`/id/${params.slug}/post/${params.id}`)
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
      location.reload()
    }
  }

  return (
    <div className="mt-3 p-1 bg-[#fff3] flex flex-col w-full">
      <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
        {avatar && (
          <div className="flex items-center justify-center grow">
            <img src={avatar} alt="post" key={avatar} className="h-72" />
          </div>
        )}
        <UploadOrShowAvatar handler={handler} slug={params.slug} />
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
        <button
          type="submit"
          className={`self-end rounded bg-primary px-2 ${
            isLoading && "opacity-50"
          }`}>
          Save
        </button>
      </form>
      {/* <NewPost slug={slug} /> */}
    </div>
  )
}
