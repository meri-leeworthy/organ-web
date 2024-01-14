"use client"

import { Button, Input } from "@/components/styled"
import { useDebounce } from "@/hooks/useDebounce"
import { IconCheck, IconX } from "@tabler/icons-react"
import React, { useState, useEffect } from "react"
import { Client } from "simple-matrix-sdk"

const SignupForm = () => {
  const [email, setEmail] = useState("")
  const [debouncedUsername, username, setUsername] = useDebounce("", 500)
  const [password, setPassword] = useState("")
  const [usernameAvailable, setUsernameAvailable] = useState(false)

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername.length > 0) {
        const available = await Client.isUsernameAvailable(
          debouncedUsername,
          "https://matrix.radical.directory"
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
    try {
      const user = await Client.register(
        username,
        password,
        "https://matrix.radical.directory"
      )
      console.log(user, "User registered successfully!")

      const { access_token: accessToken } = user

      window.localStorage.setItem("accessToken", accessToken)
      window.localStorage.setItem("userId", user.user_id)

      const client = new Client(
        "https://matrix.radical.directory",
        accessToken,
        {
          userId: user.user_id,
        }
      )

      // const 3pidResponse = client.add3pid()
    } catch (error) {
      console.error("Error registering user:", error)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-sm gap-2">
      <h2 className="font-bold">New Account</h2>
      <form className="*:flex flex flex-col gap-2 *:flex-col">
        <label>
          <span className="text-sm tracking-wider uppercase">Email</span>
          <Input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          <div className="flex items-baseline justify-between">
            <span className="text-sm tracking-wider uppercase">Username</span>
            <p className="text-xs uppercase opacity-80">
              {debouncedUsername &&
                (usernameAvailable ? (
                  <div className="flex items-center gap-1 text-green-600">
                    {"available"}
                    <IconCheck size={12} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    {"not available"}
                    <IconX size={12} />
                  </div>
                ))}
            </p>
          </div>
          <Input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label className="mb-4">
          <span className="text-sm tracking-wider uppercase">Password</span>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <Button
          type="button"
          onClick={handleSignup}
          className="self-start border border-black hover:bg-primary hover:border-transparent">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

export default SignupForm
