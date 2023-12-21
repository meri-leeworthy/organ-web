"use client"

import { useState } from "react"
import { EditableDescription } from "./EditableDescription"
import { EditableTitle } from "./EditableTitle"
import { SectionType } from "./SectionType"
import { EditableContactSection } from "./EditableContactSection"
import Redirect from "@/components/Redirect"
import { UploadOrShowAvatar, Cancel } from "@/components/ui"
import { IfModerator } from "@/components/IfModerator"
import { useRouter } from "next/navigation"

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
        <div className="flex justify-between items-start">
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
      </main>
    </IfModerator>
    // </Redirect>
  )
}
