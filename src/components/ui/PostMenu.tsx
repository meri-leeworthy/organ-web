"use client"

import { IconDotsVertical } from "@tabler/icons-react"
import { IfModerator } from "../IfModerator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { useRouter } from "next/navigation"
import { useClient } from "@/hooks/useClient"

export function PostMenu({ authorSlug }: { authorSlug: string }) {
  const router = useRouter()
  const client = useClient()

  return (
    <IfModerator slug={authorSlug}>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:outline-green-300 focus-visible:outline-dashed  p-1">
          <IconDotsVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-none shadow-none drop-shadow-hard border-black min-w-[5rem]">
          <DropdownMenuItem onSelect={() => {}} className="justify-end">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} className="justify-end">
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}} className="justify-end">
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </IfModerator>
  )
}
