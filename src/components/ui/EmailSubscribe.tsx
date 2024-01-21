"use client"

import { useClient } from "@/hooks/useClient"
import { Button } from "../styled"

export function EmailSubscribe() {
  const client = useClient()

  if (client) return null

  return (
    <form className="bg-primary rounded-lg px-2 py-1 flex flex-col gap-1 w-full justify-between  mb-8">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-between sm:items-center w-full">
        <label
          className=" text-sm opacity-80 lg:mr-8 uppercase flex gap-2 sm:gap-0 items-baseline sm:items-stretch sm:flex-col"
          htmlFor="email">
          Get email notifications
          <p className="text-xs opacity-60 italic normal-case">
            No account needed. Unsubscribe anytime.
          </p>
        </label>
        <div className="flex gap-2 grow items-center">
          <input
            type="email"
            name="email"
            placeholder="your.email@address.com"
            className="rounded bg-opacity-50 w-full grow px-1"
          />
          <Button
            type="submit"
            className="text-sm rounded-[100%] border border-black hover:border-dashed">
            Subscribe
          </Button>
        </div>
      </div>
    </form>
  )
}
