"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { Button } from "../styled"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"
import { IfLoggedIn } from "../IfLoggedIn"

const LoginLogout = () => {
  return (
    <Suspense fallback={<Login />}>
      <IfLoggedIn fallback={<Login />}>
        <Logout />
      </IfLoggedIn>
    </Suspense>
  )
}

const Login = () => {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  return <Button onClick={handleLogin}>login</Button>
}

const Logout = () => {
  const handleLogout = () => {
    if (typeof window === "undefined") return null
    localStorage.removeItem(ACCESSTOKEN_STORAGE_KEY)
    localStorage.removeItem(USERID_STORAGE_KEY)
    location.reload()
  }

  return <Button onClick={handleLogout}>logout</Button>
}

export default LoginLogout
