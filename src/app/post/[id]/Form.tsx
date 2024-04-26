"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTagToPost } from "../actions"
import { useClient } from "@/hooks/useClient"

export function Form({ postId }: { postId: string }) {
  return (
    <form
      action={async (formData: FormData) => {
        const res = await addTagToPost(formData)
        console.log("res", res)
      }}
      className="flex flex-col gap-2 p-2 max-w-sm">
      <input type="hidden" name="postId" value={postId} />
      <Input type="text" name="tag" />
      <Button type="submit">Add Tag</Button>
    </form>
  )
}
