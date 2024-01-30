"use client"

import { useRoom } from "@/hooks/useRoom"
import { organRoomUserNotifications } from "@/lib/types"
import { IconX } from "@tabler/icons-react"
import { useState } from "react"

export function EmailSubscribe({ slug }: { slug: string }) {
  const room = useRoom(slug)

  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState("")

  if (!open) return null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return

    const res = fetch(`/api/mailbox?email=${email}`)
      .then(res => res.json())
      .then((res: any) => {
        console.log(res)
        fetch(`/api/subscribe`, {
          method: "POST",
          body: JSON.stringify({
            email,
            slug,
          }),
        })
      })
  }

  return (
    <form
      className="bg-primary rounded-lg px-2 py-2 flex flex-col gap-1 w-full justify-between drop-shadow-sm  mb-4"
      onSubmit={handleSubmit}>
      <div className="flex flex-col relative sm:flex-row gap-1 sm:pr-6 sm:gap-2 justify-between sm:items-start w-full">
        <label
          className="text-xs font-medium opacity-80 lg:mr-8 uppercase flex w-full sm:w-48 shrink sm:gap-0 items-baseline sm:items-stretch flex-col"
          htmlFor="email">
          Get email notifications
          <div>
            <span className="text-xs opacity-60 italic normal-case mr-1 sm:block">
              No account needed.
            </span>
            <span className="text-xs opacity-60 italic normal-case sm:block">
              Unsubscribe anytime.
            </span>
          </div>
        </label>
        <div className="flex gap-1 grow sm:self-center sm:justify-end">
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your.email@address.com"
            className="rounded bg-opacity-50 px-1 min-w-52 grow"
          />
          <button
            type="submit"
            className="text-sm rounded px-1 border bg-primarydark text-white border-transparent hover:border-dashed">
            Subscribe
          </button>
        </div>
        <button
          className="absolute top-0 right-0"
          onClick={() => setOpen(false)}>
          <IconX size={16} />
        </button>
      </div>
    </form>
  )
}
