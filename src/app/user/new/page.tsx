"use client"

import { Button, Input } from "@/components/styled"
import React, { useState } from "react"
import { Client } from "simple-matrix-sdk"

const SignupForm = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

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
    } catch (error) {
      console.error("Error registering user:", error)
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <h2 className="font-bold">New Account</h2>
      <form className="*:flex flex flex-col gap-2 *:flex-col">
        <label>
          <span className="text-sm uppercase tracking-wider">Email</span>
          <Input type="email" value={email} onChange={handleEmailChange} />
        </label>
        <label>
          <span className="text-sm uppercase tracking-wider">Username</span>
          <Input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <label className="mb-4">
          <span className="text-sm uppercase tracking-wider">Password</span>
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </label>
        <Button
          type="button"
          onClick={handleSignup}
          className="self-start border-black border">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

export default SignupForm
