"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { newPost } from "../actions"

export function Form() {
  return (
    <form
      action={async (formData: FormData) => {
        const res = await newPost(formData)
        console.log("res", res)
      }}
      className="flex flex-col gap-2 p-2"
    >
      <Input type="text" name="content" />
      <Button type="submit">Post</Button>
    </form>
  )
}
