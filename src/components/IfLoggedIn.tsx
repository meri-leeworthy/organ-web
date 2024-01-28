"use client"

import { useClient } from "@/hooks/useClient"

export function IfLoggedIn({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const client = useClient()

  if (client) return <>{children}</>
  return fallback ? <>{fallback}</> : null
}
