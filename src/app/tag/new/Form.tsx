"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTag } from "@/app/tag/actions"

export function Form() {
  return (
    <form
      action={async (formData: FormData) => {
        const res = await addTag(formData)
        console.log("res", res)
      }}
      method="post"
      className="flex flex-col gap-2 p-2"
    >
      <Input type="text" name="tag" />
      <Button type="submit">Add</Button>
    </form>
  )
}
