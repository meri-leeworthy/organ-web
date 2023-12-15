"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "./Button"

const LoginLogout = () => {
  const router = useRouter()
  const accessToken =
    typeof localStorage !== "undefined" && localStorage.getItem("accessToken")

  const handleLogout = () => {
    if (typeof window === "undefined") return null
    if (accessToken) {
      localStorage.removeItem("accessToken")
      location.reload()
    } else {
      router.push("/login")
    }
  }

  return (
    <Button onClick={handleLogout}>
      <Suspense fallback="login">{accessToken ? "logout" : "login"}</Suspense>
    </Button>
  )
}

export default LoginLogout
