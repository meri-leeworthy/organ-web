"use client"

import { useClient } from "@/hooks/useClient"
import { useEffect, useState } from "react"

export function IfLoggedIn({
  children,
  fallback
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const client = useClient()

  useEffect(() => {
    if (client) {
      setIsLoggedIn(true)
    }
  }, [client])

  if (client || isLoggedIn) return <>{children}</>
  return fallback ? <>{fallback}</> : null
}
