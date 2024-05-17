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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { PostForm } from "./NewPost"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import { OrganEntity } from "@/types/schema"

export function PostMenu({
  authorSlug,
  post,
}: {
  authorSlug: string
  post: OrganEntity
}) {
  // const router = useRouter()
  // const client = useClient()

  return (
    <IfModerator slug={authorSlug}>
      <Dialog>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-green-300 focus-visible:outline-dashed  p-1">
              <IconDotsVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-none shadow-none drop-shadow-hard border-black min-w-[5rem]">
              <DropdownMenuItem onSelect={() => {}} className="justify-end">
                <DialogTrigger className="w-full text-right">
                  Edit
                </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}} className="justify-end">
                <AlertDialogTrigger className="w-full text-right">
                  Delete
                </AlertDialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}} className="justify-end">
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <PostForm slug={authorSlug} />
          </DialogContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </IfModerator>
  )
}
