"use client"

const MATRIX_BASE_URL = "https://matrix.radical.directory"

import React, { useState } from "react"
import { Client } from "simple-matrix-sdk"
import { useRouter } from "next/navigation"
import { Button } from "@/components/styled/Button"
import { set } from "valibot"
import { ErrorBox } from "@/components/ui/ErrorBox"
import { Input } from "@/components/styled"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

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
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("userId", `@${username}:radical.directory`)
      router.push("/")
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
          Sign Up
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
