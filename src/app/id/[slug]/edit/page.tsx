"use client"

import { useEffect, useState } from "react"
import { EditableDescription } from "./EditableDescription"
import { EditableTitle } from "./EditableTitle"
import { SectionType } from "./SectionType"
import { EditableContactSection } from "./EditableContactSection"
import { UploadOrShowAvatar, Cancel } from "@/components/ui"
import { IfModerator } from "@/components/IfModerator"
import { useRouter } from "next/navigation"
import { useRoom } from "@/hooks/useRoom"

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
        <div className="flex items-start justify-between">
          <UploadOrShowAvatar slug={slug} />

          <Cancel onClick={() => router.push(`/id/${slug}`)} />
        </div>
        <EditableTitle {...{ editSection, setEditSection, slug }} />
        <EditableDescription
          {...{
            editSection,
            setEditSection,
            slug,
          }}
        />

        <EditableContactSection
          {...{
            editSection,
            setEditSection,
            slug,
          }}
        />
        <UserRoles slug={slug} />
      </main>
    </IfModerator>
    // </Redirect>
  )
}

function UserRoles(props: { slug: string }) {
  const room = useRoom(props.slug)

  const [roles, setRoles] = useState<Record<string, number>>({})

  useEffect(() => {
    room?.getPowerLevels().then(powerLevels => {
      console.log("powerLevels", powerLevels)
      setRoles(powerLevels.users)
    })
  }, [room])

  const admins = Object.entries(roles).filter(tuple => tuple[1] === 100)
  const moderators = Object.entries(roles).filter(tuple => tuple[1] === 50)
  const followers = Object.entries(roles).filter(tuple => tuple[1] === 0)

  //this is not a list of all users, just a list of users with roles

  return (
    <div>
      <h3>Admins</h3>
      {admins.map(tuple => (
        <p key={tuple[0]}>
          {tuple[0]}: {tuple[1]}
        </p>
      ))}
      <h3>Moderators</h3>
      {moderators.map(tuple => (
        <p key={tuple[0]}>
          {tuple[0]}: {tuple[1]}
        </p>
      ))}
      <h3>Followers</h3>
      {followers.map(tuple => (
        <p key={tuple[0]}>
          {tuple[0]}: {tuple[1]}
        </p>
      ))}
    </div>
  )
}
