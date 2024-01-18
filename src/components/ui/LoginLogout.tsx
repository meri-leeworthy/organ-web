"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "../styled"

const LoginLogout = () => {
  const router = useRouter()
  const accessToken =
    typeof localStorage !== "undefined" && localStorage.getItem("accessToken")
  const userId =
    typeof localStorage !== "undefined" && localStorage.getItem("userId")

  const loggedIn = accessToken && userId && true

  const handleLogout = () => {
    if (typeof window === "undefined") return null
    if (loggedIn) {
      localStorage.removeItem("accessToken")
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
