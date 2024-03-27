"use client"

import { Username } from "@/components/ui"
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
      <DropdownMenuTrigger className="focus-visible:outline-green-300 p-1">
        <IconMenu />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => router.push("/")}>
          Home
        </DropdownMenuItem>
        <DropdownMenuGroup>
          {client ? (
            <>
              <DropdownMenuItem>My Account</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem>Login</DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
