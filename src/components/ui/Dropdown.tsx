"use client"

import { useState } from "react"
import { OptionsButton } from "../styled/IconButton"
import Link from "next/link"
import { useOutsideClick } from "@/hooks/useOutsideClick"

export function Dropdown({
  children,
  size,
}: {
  children: React.ReactNode
  size?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useOutsideClick(() => {
    setIsOpen(false)
  })
  return (
    <div className="relative justify-self-end ">
      <OptionsButton onClick={() => setIsOpen(!isOpen)} size={size} />
      {isOpen && (
        <div
          ref={ref}
          className={`z-10 absolute drop-shadow right-0 mt-1 w-28 bg-white items-end rounded p-1 flex flex-col justify-center ${
            !isOpen && "hidden"
          }`}>
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem(
  props: {
    children: React.ReactNode
  } & (
    | { onClick: () => void }
    | {
        href: string
      }
  )
) {
  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href || ""}
        className="w-full px-1 text-sm text-left text-black rounded-sm hover:bg-gray-100">
        {props.children}
      </Link>
    )
  }
  return (
    <button
      onClick={("onClick" in props && props.onClick) || (() => {})}
      className="w-full px-2 py-1 text-sm text-left text-black rounded-sm hover:bg-gray-100">
      {props.children}
    </button>
  )
}
