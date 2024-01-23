"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"

export const CreatePageAccount = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const accessToken =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
  const userId =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(USERID_STORAGE_KEY)

  const loggedIn = isClient && accessToken && userId && true

  return (
    <Suspense fallback={<CreateAccount />}>
      {loggedIn ? <CreatePage /> : <CreateAccount />}
    </Suspense>
  )
}

function CreateAccount() {
  return <Link href="/user/new">Create Account</Link>
}

function CreatePage() {
  return <Link href="/id/new">Create Page</Link>
}
