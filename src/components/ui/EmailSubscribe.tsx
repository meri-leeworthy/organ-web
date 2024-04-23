"use client"

import { useRoom } from "@/hooks/useRoom"
import { IconMail, IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Input } from "./input"
import { Button } from "./button"
import { Switch } from "./switch"
import { set } from "valibot"
import { organRoomUserNotifications } from "@/types/schema"

export function EmailSubscribe({
  slug,
  dismissable,
}: {
  slug: string
  dismissable?: boolean
}) {
  const room = useRoom(slug)

  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [hash, setHash] = useState("")

  useEffect(() => {
    if (!room) return
    room.client.getUser3pids().then((res: any) => {
      const email = res.threepids.find((id: any) => id.medium === "email")
      if (email) {
        setEmail(email.address)
        fetch("/api/hash?value=" + email.address)
          .then(res => res.json())
          .then(res => {
            console.log(res)
            setHash(res.hmac.slice(0, 32))
          })
      }
    })
  }, [room])

  useEffect(() => {
    // console.log("running hash useeffect")
    if (!hash || !room) return
    // console.log("getting state")
    room.getState().then(res => {
      if ("errcode" in res) return

      const notificationPrefs = res.get(organRoomUserNotifications, hash)

      if (!notificationPrefs) return
      const content = notificationPrefs.content

      if (
        typeof content === "object" &&
        content !== null &&
        "email" in content &&
        content.email === "never"
      ) {
        setSubscribed(true)
      } else {
        console.log("didn't find hash " + hash)
      }

      // if (
      //   res.some(
      //     (stateEvent: any) =>
      //       stateEvent.type === organRoomUserNotifications &&
      //       stateEvent.state_key === hash &&
      //       stateEvent.content.email !== "never"
      //   )
      // ) {
      //   // console.log("user is subscribed. found hash " + hash)
      //   setSubscribed(true)
      // } else {
      //   // console.log("didn't find hash " + hash)
      // }
      console.log(res)
      // const notificationsEvents = res.filter(
      //   (stateEvent: any) => stateEvent.type === organRoomUserNotifications
      // )
      // console.log(notificationsEvents)
    })
  }, [hash, room])

  if (!open || (room && !finished && subscribed)) return null

  function handleSubscribe(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    if (!email) return

    setLoading(true)

    fetch(`/api/subscribe`, {
      method: "POST",
      body: JSON.stringify({
        email,
        slug,
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
      })
    setLoading(false)
    setFinished(true)
  }

  function handleToggle(checked: boolean) {
    setSubscribed(checked)
    if (checked) {
      handleSubscribe()
      return
    }
    fetch(`/api/unsubscribe`, {
      method: "POST",
      body: JSON.stringify({
        email,
        slug,
      }),
    }).then(res => {
      console.log(res)
    })
  }

  return (
    <Alert className="">
      <IconMail size={20} />
      <AlertTitle>Get email notifications</AlertTitle>
      <AlertDescription>
        {room ? (
          <>
            Every time a post is made, you will get an email at{" "}
            <strong className="font-medium">{email}</strong>.
          </>
        ) : (
          "No account needed. Unsubscribe anytime. "
        )}
      </AlertDescription>
      {!room && finished ? (
        <p>You have subscribed! You should have got a confirmation email.</p>
      ) : (
        <form className="flex gap-1 w-full mt-2" onSubmit={handleSubscribe}>
          {room ? (
            <>
              <Switch
                id="email-notifications"
                checked={subscribed}
                onCheckedChange={handleToggle}
              />
              <label htmlFor="email-notifications" className="opacity-60">
                Email on every post
              </label>
            </>
          ) : (
            <div className="flex gap-1 grow sm:self-center sm:justify-end">
              <Input
                type="email"
                name="email"
                disabled={loading}
                aria-label="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@address.com"
                className="" //rounded bg-opacity-50 px-1 min-w-52 grow
              />
              <Button
                type="submit" //text-sm rounded px-1 border bg-primarydark text-white border-transparent hover:border-dashed
                disabled={loading}
                className="bg-primarydark">
                Subscribe
              </Button>
            </div>
          )}
        </form>
      )}
      {dismissable && (
        <button
          className="absolute top-3 right-4"
          onClick={() => setOpen(false)}>
          <IconX
            size={16}
            className="rounded-full hover:text-primarydark p-0"
          />
        </button>
      )}
    </Alert>
  )
}
