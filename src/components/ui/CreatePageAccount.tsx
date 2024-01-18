"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"

export const CreatePageAccount = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const accessToken =
    typeof localStorage !== "undefined" && localStorage.getItem("accessToken")
  const userId =
    typeof localStorage !== "undefined" && localStorage.getItem("userId")

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
