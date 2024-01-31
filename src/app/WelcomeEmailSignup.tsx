"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconMail, IconX } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"

export function WelcomeEmailSignup() {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <Alert className="">
      <AlertTitle>🐣 Hello, thanks for visiting!</AlertTitle>

      <AlertDescription>
        <p className="text-sm mb-1">
          Organ is a new open source, decentralised platform for social
          movements and political organising.{" "}
          <Link
            href="/id/TsXqgBBNBLnfASIfXn/post/C86DPeol1OCQnM6IB3Vir2pEII8eZNzdDbK5jTWOxZM"
            className="underline hover:decoration-dashed decoration-solid">
            learn more
          </Link>
        </p>

        <p className="text-sm">
          If you want to get email updates on this project, subscribe{" "}
          <Link
            href="/id/TsXqgBBNBLnfASIfXn"
            className="underline hover:decoration-dashed decoration-solid">
            here
          </Link>
          .
        </p>
      </AlertDescription>
      <button className="absolute top-3 right-4" onClick={() => setOpen(false)}>
        <IconX size={16} className="rounded-full hover:text-primarydark p-0" />
      </button>
    </Alert>
  )
}
