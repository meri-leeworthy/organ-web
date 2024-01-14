"use client"

import { IconMail, IconX } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

export function WelcomeEmailSignup() {
  const [open, setOpen] = useState(true)
  const [subscribed, setSubscribed] = useState(false)

  if (!open) return null

  return (
    <div className="flex flex-col gap-2 p-3 mb-4 rounded bg-primary">
      <h3 className="flex w-full text-base font-medium">
        🐣 Hello, thanks for visiting!
        <button className="ml-auto" onClick={() => setOpen(false)}>
          <IconX size={20} />
        </button>
      </h3>

      <p className="text-sm">
        Organ is a new open source, decentralised platform for social movements
        and political organising.{" "}
        <Link
          href="/id/TsXqgBBNBLnfASIfXn/post/C86DPeol1OCQnM6IB3Vir2pEII8eZNzdDbK5jTWOxZM"
          className="underline decoration-dashed hover:decoration-solid">
          learn more
        </Link>
      </p>
      <p className="text-sm">
        If you&apos;re interested and want to support this project, sign up for
        email updates below.
      </p>
      {subscribed === false ? (
        <form
          className="flex justify-between gap-2"
          action={async (formData: FormData) => {
            const email = formData.get("email")
            const result = await fetch("/api/subscribe", {
              method: "POST",
              body: JSON.stringify({ email }),
            })
            const json = await result.json()
            // console.log("json", json)
            setSubscribed(true)
          }}>
          <label className="flex items-center grow">
            <span className="mr-2 text-sm uppercase">
              <IconMail size={16} />
            </span>
            <input
              type="email"
              name="email"
              aria-label="Email Address"
              placeholder="your@emailaddress.net"
              className="w-full px-1 rounded focus:outline-1 focus:outline-primary"
            />
          </label>
          <button
            type="submit"
            className="border border-black hover:bg-white hover:border-transparent rounded-[100%] px-2">
            Sign Up
          </button>
        </form>
      ) : (
        <p className="text-sm">Thanks for signing up!</p>
      )}
    </div>
  )
}
