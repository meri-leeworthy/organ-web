"use client"

const {
  NEXT_PUBLIC_MATRIX_BASE_URL: MATRIX_BASE_URL,
  NEXT_PUBLIC_SERVER_NAME: SERVER_NAME,
} = process.env

import React, { useEffect, useState } from "react"
import { Client } from "simple-matrix-sdk"
import { useRouter } from "next/navigation"
import { Button } from "@/components/styled/Button"
import { ErrorBox } from "@/components/ui/ErrorBox"
import { Input } from "@/components/styled"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"
import { useClient } from "@/hooks/useClient"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const client = useClient()

  useEffect(() => {
    if (client) router.push("/")
  }, [client, router])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      console.log("Matrix base url", MATRIX_BASE_URL)
      const accessToken = await Client.login(
        MATRIX_BASE_URL!,
        username,
        password
      )
      localStorage.setItem(ACCESSTOKEN_STORAGE_KEY, accessToken)
      localStorage.setItem(
        USERID_STORAGE_KEY,
        `@${username.trim().toLowerCase()}:${SERVER_NAME}`
      )
      router.refresh()
    } catch (error) {
      console.error("Error logging in:", error)
      const stringError =
        (typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string" &&
          error.message) ||
        ""

      setError(stringError as string)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm gap-2 p-4 bg-white rounded drop-shadow-sm">
      <h2 className="font-bold">Login</h2>
      <form
        onSubmit={handleLogin}
        className="*:flex flex flex-col gap-2 *:flex-col">
        <label>
          <span className="text-sm tracking-wider uppercase">Username</span>

          <Input
            type="text"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            disabled={loading}
          />
        </label>
        <label className="mb-4">
          <span className="text-sm tracking-wider uppercase">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            disabled={loading}
          />
        </label>
        <ErrorBox error={error} />
        <Button
          type="submit"
          className="self-end border border-black hover:border-dashed">
          Login
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
