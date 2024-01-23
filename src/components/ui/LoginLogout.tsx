"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "../styled"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"

const LoginLogout = () => {
  const router = useRouter()
  const accessToken =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
  const userId =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(USERID_STORAGE_KEY)

  const loggedIn = accessToken && userId && true

  const handleLogout = () => {
    if (typeof window === "undefined") return null
    if (loggedIn) {
      localStorage.removeItem(ACCESSTOKEN_STORAGE_KEY)
      localStorage.removeItem(USERID_STORAGE_KEY)
      location.reload()
    } else {
      router.push("/login")
    }
  }

  return (
    <Button onClick={handleLogout}>
      <Suspense fallback="login">{loggedIn ? "logout" : "login"}</Suspense>
    </Button>
  )
}

export default LoginLogout
