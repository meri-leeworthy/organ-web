"use client"
import { ACCESSTOKEN_STORAGE_KEY, USERID_STORAGE_KEY } from "@/lib/constants"

export const handleLogout = () => {
  if (typeof window === "undefined") return null
  localStorage.removeItem(ACCESSTOKEN_STORAGE_KEY)
  localStorage.removeItem(USERID_STORAGE_KEY)
  location.reload()
}
