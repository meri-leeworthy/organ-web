"use client"

import { useEffect } from "react"
import { redirect } from "next/navigation"
import { useClient } from "@/hooks/useClient"
import { useRouter } from "next/navigation"

const Redirect = ({
  children,
  redirect,
}: {
  children: JSX.Element
  redirect: string
}) => {
  const client = useClient()
  const router = useRouter()

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!client) router.push(redirect)
    }, 2000)
    return () => {
      clearTimeout(debounce)
    }
  }, [redirect, client, router])

  return children
}

export default Redirect
