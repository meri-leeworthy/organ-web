"use client"

import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/useClient"
import { useEffect, useState } from "react"

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
  const baseUrl = "https://matrix.radical.directory/_matrix/"

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESSTOKEN_STORAGE_KEY)
    const userId = localStorage.getItem(USERID_STORAGE_KEY)

    setAccessToken(accessToken || "")
    setUserId(userId || "")
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
          className="border border-black rounded bg-slate-100 max-w-sm w-full"
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
          className="border border-black rounded px-1 bg-slate-100 max-w-sm w-full"
          onChange={event => setEndpoint(event.target.value)}
        />
      </label>
      <label>
        params
        <input
          value={params}
          className="border border-black rounded px-1 bg-slate-100 max-w-sm w-full"
          onChange={event => setParams(event.target.value)}
        />
      </label>

      <label>
        body:{" "}
        <input
          value={body}
          className="border border-black rounded px-1 bg-slate-100 max-w-sm w-full"
          onChange={event => setBody(event.target.value)}
        />
      </label>
      <pre className="font-mono text-xs my-4 rounded bg-stone-100 border border-stone-300 p-2  overflow-scroll">
        {method}
        <br />
        {baseUrl}
        {endpoint}?{params}
        <br />
        {body}
      </pre>
      <button type="submit" className="border px-1 rounded self-end">
        Submit
      </button>
      {isLoading ||
        error ||
        (response && (
          <pre className="font-mono text-xs my-4 rounded bg-slate-100 border border-slate-300 p-2 overflow-scroll">
            {isLoading && "Loading..."}
            {error && error}
            {response && response}
          </pre>
        ))}
    </form>
  )
}
