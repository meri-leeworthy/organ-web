"use client"

import { useEffect, useState } from "react"
import { EditableDescription } from "./EditableDescription"
import { EditableTitle } from "./EditableTitle"
import { SectionType } from "./SectionType"
import { EditableContactSection } from "./EditableContactSection"
import {
  UploadOrShowAvatar,
  Cancel,
  Dropdown,
  DropdownItem,
} from "@/components/ui"
import { IfModerator } from "@/components/IfModerator"
import { useRouter } from "next/navigation"
import { useRoom } from "@/hooks/useRoom"
import { is } from "valibot"
import { ClientEventOutput, ErrorSchema } from "simple-matrix-sdk"
import { HOME_SPACE } from "@/lib/constants"

export default function OrgSlugDashboardPage({
  params,
}: {
  params: { slug: string }
}) {
  const [editSection, setEditSection] = useState<SectionType>(null)

  const { slug } = params
  const router = useRouter()

  return (
    // <Redirect roomId={slug}>
    <IfModerator slug={slug}>
      <main className="flex flex-col w-full">
        <div className="p-4 mb-4 bg-white border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <UploadOrShowAvatar slug={slug} />

              <EditableTitle {...{ editSection, setEditSection, slug }} />
            </div>
            <Cancel onClick={() => router.push(`/id/${slug}`)} />
          </div>
          <hr className="my-4" />
          <EditableDescription
            {...{
              editSection,
              setEditSection,
              slug,
            }}
          />
          <hr className="my-4" />
          <h2 className="mb-2 text-base font-medium">Links</h2>
          <EditableContactSection
            {...{
              editSection,
              setEditSection,
              slug,
            }}
          />
          <hr className="my-4" />
          <UserRoles slug={slug} />

          <RequestPublication slug={slug} />
        </div>
      </main>
    </IfModerator>
    // </Redirect>
  )
}

function UserRoles(props: { slug: string }) {
  const room = useRoom(props.slug)

  const [roles, setRoles] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    room
      ?.getPowerLevels()
      .then((powerLevels: { users: Record<string, number> }) => {
        console.log("powerLevels", Object.entries(powerLevels.users)[0])
        const roles = new Map(Object.entries(powerLevels.users))
        room?.getMembers().then(res => {
          if (is(ErrorSchema, res)) return
          const members = res.chunk.map(event => event.state_key)
          console.log("members", members)
          for (const member of members) {
            console.log("member", member)
            if (!member) continue
            if (!roles.has(member)) {
              roles.set(member, 0)
            }
          }
          roles.delete("@_relay_bot:radical.directory")
          setRoles(roles)
        })
      })
  }, [room])

  const rolesArray = [...roles.entries()]

  function username(userId: string) {
    return userId.split(":")[0].slice(1)
  }

  async function setPowerLevel(userId: string, level: number) {
    await room?.setUserPowerLevel(userId, level)
    setRoles(new Map(roles.set(userId, level)))
  }

  return (
    <div className="mt-6">
      <h2 className="mb-2 text-base font-medium">Users</h2>
      <ul>
        {rolesArray.map(tuple => {
          const user = username(tuple[0])
          const badge =
            tuple[1] === 100 ? "admin" : tuple[1] === 50 ? "mod" : null
          return (
            <li className="flex items-center gap-2 my-1" key={tuple[0]}>
              <span className="text-sm font-light tracking-wide">{user}</span>
              {badge && <Badge label={badge} />}
              <Dropdown size={12}>
                {badge !== "admin" && (
                  <DropdownItem onClick={() => setPowerLevel(tuple[0], 100)}>
                    Make Admin
                  </DropdownItem>
                )}
                {badge !== "mod" && (
                  <DropdownItem onClick={() => setPowerLevel(tuple[0], 50)}>
                    Make Mod
                  </DropdownItem>
                )}
                {badge !== null && (
                  <DropdownItem onClick={() => setPowerLevel(tuple[0], 0)}>
                    Remove Role
                  </DropdownItem>
                )}
              </Dropdown>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Badge({ label }: { label: string }) {
  return (
    <div className="px-1 text-xs uppercase rounded bg-primary">{label}</div>
  )
}

function RequestPublication({ slug }: { slug: string }) {
  const [requested, setRequested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(true)

  const homeSpace = HOME_SPACE.split(":")[0].slice(1)
  const room = useRoom(homeSpace)
  room?.getHierarchy().then(res => {
    if (is(ErrorSchema, res)) return
    const roomIds = res[0].children_state.map(
      (event: ClientEventOutput) => event.state_key
    )
    console.log("rooms", roomIds)
    const isPublished = roomIds.some(
      (roomId: string) => roomId === `!${slug}:radical.directory`
    )
    setIsPublished(isPublished)
  })

  async function requestPublication() {
    setIsLoading(true)
    const res = await fetch("/api/requestpub", {
      method: "POST",
      body: JSON.stringify({
        roomId: `!${slug}:radical.directory`,
      }),
    })
    console.log("res", res)
    setRequested(true)
  }

  if (isPublished) return null

  return (
    <>
      <hr className="my-4" />
      {requested ? (
        <p>Requested!</p>
      ) : (
        <button
          className="px-2 py-1 rounded bg-primary hover:bg-primarydark hover:text-white drop-shadow-sm disabled:opacity-60"
          onClick={requestPublication}
          disabled={isLoading}>
          Request Publication to Homepage
        </button>
      )}
    </>
  )
}
