"use client"

import { Pre } from "@/components/styled/Pre"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"
import { useEffect, useState } from "react"

const { NEXT_PUBLIC_MATRIX_BASE_URL: MATRIX_BASE_URL } = process.env

export default function RequestTester() {
  const [accessToken, setAccessToken] = useState("")
  const [userId, setUserId] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [method, setMethod] = useState("")
  const [params, setParams] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [response, setResponse] = useState("")
  const baseUrl = MATRIX_BASE_URL + "/_matrix/"

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
    const userId = localStorage.getItem(USERID_STORAGE_KEY)

    setAccessToken(accessToken || "")
    setUserId(userId ? userId.trim().toLowerCase() : "")
  }, [])

  async function handleRequestSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const request: any = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
    if (method !== "GET") {
      request.body = body
    }
    const response = await fetch(
      baseUrl.trim() + endpoint.trim() + "?" + params.trim(),
      request
    )
    const json = await response.json()
    setResponse(JSON.stringify(json, null, 2))
    setIsLoading(false)
  }

  return (
    <form
      className="max-w-lg w-full flex flex-col gap-2 *:flex *:gap-2 *:justify-between"
      onSubmit={handleRequestSubmit}>
      <p className="flex items-baseline">
        accessToken: <pre className="font-mono text-xs">{accessToken}</pre>
      </p>
      <p>
        userId: <pre className="font-mono text-xs">{userId}</pre>
      </p>
      <p>
        baseurl: <pre className="font-mono text-xs">{baseUrl}</pre>
      </p>
      <label className="flex w-full">
        method:
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="w-full max-w-sm border border-black rounded bg-slate-100"
          required>
          <option></option>
          <option>GET</option>
          <option>PUT</option>
          <option>POST</option>
        </select>
      </label>
      <label>
        endpoint
        <input
          value={endpoint}
          className="w-full max-w-sm px-1 border border-black rounded bg-slate-100"
          onChange={event => setEndpoint(event.target.value)}
        />
      </label>
      <label>
        params
        <input
          value={params}
          className="w-full max-w-sm px-1 border border-black rounded bg-slate-100"
          onChange={event => setParams(event.target.value)}
        />
      </label>

      <label>
        body:{" "}
        <input
          value={body}
          className="w-full max-w-sm px-1 border border-black rounded bg-slate-100"
          onChange={event => setBody(event.target.value)}
        />
      </label>
      <Pre>
        {method}
        <br />
        {baseUrl}
        {endpoint}?{params}
        <br />
        {body}
      </Pre>
      <button type="submit" className="self-end px-1 border rounded">
        Submit
      </button>
      {isLoading ||
        error ||
        (response && (
          <Pre>
            {isLoading && "Loading..."}
            {error && error}
            {response && response}
          </Pre>
        ))}
    </form>
  )
}
