"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTagToPost } from "../actions"
// import { useClient } from "@/hooks/useClient"

// ideally this should search for tags as you type, then you can click ones that come up or choose to add a new one

export function Form({ postId }: { postId: string }) {
  return (
    <form
      action={async (formData: FormData) => {
        console.log("formData tag", formData.get("tag"))
        console.log("formData postId", formData.get("postId"))
        try {
          const res = await addTagToPost(formData)
          console.log("res", res)
        } catch (e) {
          console.error(e)
        }
      }}
      className="flex flex-col gap-2 p-2 max-w-sm">
      <input type="hidden" name="postId" value={postId} />
      <Input type="text" name="tag" />
      <Button>Add Tag</Button>
    </form>
  )
}
