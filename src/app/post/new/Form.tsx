"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newPost } from "../actions"
import { useClient } from "@/hooks/useClient"
import { props } from "@/lib/utils"

export function Form() {
  const client = useClient()
  if (!client) return "not logged in"
  const userId = client.userId
  return (
    <form
      action={async (formData: FormData) => {
        const res = await newPost(formData)
        console.log("res", res)
        //accept invite from user end
        if (typeof res === "object" && "errcode" in res)
          throw new Error("error creating post")
        await client.joinRoom(res)
      }}
      className="flex flex-col gap-2 p-2"
    >
      <input type="hidden" name="userId" value={userId} />
      <Input type="text" name="title" />
      <Input type="text" name="content" />
      <Button type="submit">Post</Button>
    </form>
  )
}
