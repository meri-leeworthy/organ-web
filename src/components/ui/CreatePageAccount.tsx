"use client"

import { Suspense } from "react"
import Link from "next/link"
import { IfLoggedIn } from "../IfLoggedIn"

export const CreatePageAccount = () => {
  return (
    <Suspense fallback={<CreateAccount />}>
      <IfLoggedIn fallback={<CreateAccount />}>
        <CreatePage />
      </IfLoggedIn>
    </Suspense>
  )
}

function CreateAccount() {
  return <Link href="/user/new">Create Account</Link>
}

function CreatePage() {
  return <Link href="/id/new">Create Page</Link>
}
