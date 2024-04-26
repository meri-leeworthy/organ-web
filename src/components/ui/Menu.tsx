"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { useClient } from "@/hooks/useClient"
import { IconMenu } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export function Menu() {
  const router = useRouter()
  const client = useClient()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-green-300 focus-visible:outline-dashed  p-1">
        <IconMenu />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-none shadow-none drop-shadow-hard border-black min-w-[5rem]">
        <DropdownMenuItem
          onSelect={() => router.push("/")}
          className="justify-end">
          Home
        </DropdownMenuItem>
        <DropdownMenuGroup>
          {client ? (
            <>
              <DropdownMenuItem className="justify-end">
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem className="justify-end">
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem className="justify-end">Login</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
