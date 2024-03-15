"use client"

import { Button, Input } from "@/components/styled"
import { ErrorBox } from "@/components/ui/ErrorBox"
import { useClient } from "@/hooks/useClient"
import { useDebounce } from "@/hooks/useDebounce"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"
import { IconCheck, IconX } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { Client, ErrorSchema } from "simple-matrix-sdk"
import { is, set } from "valibot"

const SignupForm = () => {
  const [email, setEmail] = useState("")
  const [debouncedUsername, username, setUsername] = useDebounce("", 500)
  const [password, setPassword] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)
  const client = useClient()
  const router = useRouter()

  useEffect(() => {
    if (client && !awaitingConfirmation) router.push("/")
  }, [client, router, awaitingConfirmation])

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername.length > 0) {
        const available = await Client.isUsernameAvailable(
          debouncedUsername,
          process.env.NEXT_PUBLIC_MATRIX_BASE_URL!
        )
        setUsernameAvailable(available)
      }
    }
    checkUsername()
  }, [debouncedUsername])

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      const user = await Client.register(username, password, MATRIX_BASE_URL!)
      if (is(ErrorSchema, user)) throw new Error(user.error)

      console.log(user, "User registered successfully!")

      const { access_token: accessToken } = user

      window.localStorage.setItem(ACCESSTOKEN_STORAGE_KEY, accessToken)
      window.localStorage.setItem(
        USERID_STORAGE_KEY,
        user.user_id.trim().toLowerCase()
      )

      const client = new Client(MATRIX_BASE_URL!, accessToken, {
        userId: user.user_id,
      })

      const clientSecret = Math.random().toString(36).substring(2, 15)

      console.log(clientSecret, "clientSecret")

      const emailValidate = await client.requestTokenEmail(email, clientSecret)

      if (is(ErrorSchema, emailValidate)) throw new Error(emailValidate.error)

      console.log(emailValidate, "emailValidate")

      setAwaitingConfirmation(true)
      setSuccess(true)
    } catch (error) {
      console.log("Error registering user:", error)

      const stringError =
        (typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string" &&
          error.message) ||
        ""

      setError(stringError as string)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col w-full max-w-sm gap-2 p-4 bg-white rounded drop-shadow-sm">
      <h2 className="font-bold">New Account</h2>
      {success ? (
        <p>
          You did the form and an email has been sent to your account! Now
          please click the link in the email to confirm 🧚 <br />
          <button
            onClick={() => {
              setAwaitingConfirmation(false)
              router.refresh()
            }}
            className="block mt-2 hover:underline">
            finished &rarr;
          </button>
        </p>
      ) : (
        <form className="*:flex flex flex-col gap-2 *:flex-col">
          <label>
            <span className="text-sm tracking-wider uppercase">Email</span>
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
          </label>
          <label>
            <div className="flex items-baseline justify-between">
              <span className="text-sm tracking-wider uppercase">Username</span>
              <p className="text-xs uppercase opacity-80">
                {debouncedUsername &&
                  (usernameAvailable ? (
                    <span className="flex items-center gap-1 text-green-600">
                      {"available"}
                      <IconCheck size={12} />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      {"not available"}
                      <IconX size={12} />
                    </span>
                  ))}
              </p>
            </div>
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              disabled={loading}
            />
          </label>
          <label className="mb-4">
            <span className="text-sm tracking-wider uppercase">Password</span>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
          </label>
          <ErrorBox error={error} />
          <Button
            type="button"
            onClick={handleSignup}
            className="self-end border border-black hover:border-dashed">
            Sign Up
          </Button>
        </form>
      )}
    </div>
  )
}

export default SignupForm
