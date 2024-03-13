"use client"
import { useEffect, useRef, useState } from "react"

import { OrganMetaContactUnstable, organMetaContactUnstable } from "@/lib/types"

import { SectionType, sections } from "./SectionType"
import { useRoom } from "@/hooks/useRoom"
import { fetchContactKVs } from "@/lib/fetchContactKVs"
import { IconCheck, IconEdit, IconLink, IconPlus } from "@tabler/icons-react"
import { Spinner } from "@/components/ui"
import * as v from "valibot"
import { ClientEventSchema } from "simple-matrix-sdk"

export function EditableContactSection({
  slug,
  editSection,
  setEditSection,
}: {
  slug: string
  editSection: SectionType
  setEditSection: (section: SectionType) => void
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [links, setLinks] = useState<OrganMetaContactUnstable["value"]>([])
  const room = useRoom(slug)
  useEffect(() => {
    if (!room || !isLoading) return
    room
      .getStateEvent(organMetaContactUnstable, "link")
      .then(event => {
        console.log("event", event)
        if (!event || "errcode" in event) {
          setError("Failed to fetch contact links")
          return
        }
        const links =
          v.is(ClientEventSchema, event) &&
          typeof event.content === "object" &&
          event.content !== null &&
          "value" in event.content &&
          Array.isArray(event.content.value) &&
          event.content.value
        setLinks(links || [])
        setIsLoading(false)
      })
      .catch(() => undefined)

    // fetchContactKVs(room).then(contactKVs => {
    //   contactKVs["links"] && setLinks(contactKVs["links"])
    //   setIsLoading(false)
    // })
  }, [room, isLoading, links])

  function updateContacts(links: OrganMetaContactUnstable["value"]) {
    const content: OrganMetaContactUnstable = {
      type: "link",
      value: links,
    }
    room
      ?.sendStateEvent(organMetaContactUnstable, content, "link")
      .then(result => {
        console.log("result", result)
      })
  }

  return (
    <div className="flex flex-col items-start gap-1 mt-4">
      {isLoading ? (
        <Spinner className="w-4 h-4 text-black animate-spin fill-pink-600" />
      ) : editSection === sections.contact ? (
        <>
          {links.map((_, i) => {
            return (
              <input
                type="url"
                className="border border-grey rounded px-1"
                key={i}
                value={links[i]}
                onChange={e => {
                  const newLinks = [...links]
                  newLinks[i] = e.target.value
                  setLinks(newLinks)
                }}
              />
            )
          })}
        </>
      ) : (
        <>
          <ul className="flex flex-col items-start gap-1">
            {links.map((link, i) => {
              return (
                <li
                  key={i}
                  className="flex gap-2 items-center opacity-70 uppercase text-xs">
                  <IconLink size={16} />
                  {link}
                </li>
              )
            })}
          </ul>
        </>
      )}
      <div className="flex">
        <button
          className="flex items-center mt-2 gap-1 uppercase text-xs border border-transparent hover:border-grey rounded px-1"
          onClick={() => {
            setLinks([...links, ""])
            setEditSection("contact")
          }}>
          <IconPlus size={12} />
          Add Link
        </button>
        {editSection === sections.contact ? (
          <button
            className="flex items-center mt-2 gap-1 uppercase text-xs border border-transparent hover:border-grey rounded px-1"
            onClick={() => {
              const newLinks = [...links].filter(link => link !== "")

              setLinks(newLinks)
              //update
              updateContacts(newLinks)
              setEditSection(null)
            }}>
            <IconCheck size={12} />
            Save
          </button>
        ) : (
          links.length > 0 && (
            <button
              className="flex items-center mt-2 gap-1 uppercase text-xs border border-transparent hover:border-grey rounded px-1"
              onClick={() => {
                setEditSection("contact")
              }}>
              <IconEdit size={12} />
              Edit
            </button>
          )
        )}
      </div>
    </div>
  )
}

// export function EditableContactSection({
//   editSection,
//   setEditSection,
//   slug,
// }: {
//   editSection: SectionType
//   setEditSection: (section: SectionType) => void
//   slug: string
// }) {
//   const [contactKVs, setContactKVs] = useState<
//     Record<string, string | undefined>
//   >({})
//   const room = useRoom(slug)
//   const initialKVs = useRef<Partial<Record<ContactType, string>>>({})

//   useEffect(() => {
//     if (!room || Object.keys(contactKVs).length === 0) return
//     fetchContactKVs(room).then(contactKVs => {
//       initialKVs.current = contactKVs
//       setContactKVs(contactKVs)
//     })
//   }, [room, contactKVs])

//   // useEffect(() => {

//   //   for (const [contactType, _] of Object.entries(contactTypes)) {
//   //     const contactValue = contactKVs[contactType]
//   //     updateContact(contactType as ContactType, contactValue || "")
//   //   }
//   // }, [editSection, contactKVs, room])

//   function setContactKV(contactType: ContactType, contactValue?: string) {
//     // console.log("setting contact kv", contactType, contactValue)
//     setContactKVs({ ...contactKVs, [contactType]: contactValue })
//   }
//   function removeContactKV(contactType: ContactType) {
//     const { [contactType]: _, ...rest } = contactKVs
//     setContactKVs(rest)
//   }

//   if (editSection === sections.contact)
//     return (
//       <div className="flex justify-between py-4">
//         <EditableContacts {...{ contactKVs, setContactKV, removeContactKV }} />
//         <DoneButton
//           label="Done"
//           onClick={() => {
//             setEditSection(null)
//           }}
//         />
//       </div>
//     )
//   else {
//     for (const [contactType, contactValue] of Object.entries(contactKVs)) {
//       if (!contactValue) {
//         removeContactKV(contactType as ContactType)
//       }
//     }
//     return (
//       <div className="flex justify-between py-4">
//         <Contact contactKVs={contactKVs} />
//         <EditButton
//           alt="Edit links"
//           onClick={() => setEditSection("contact")}
//         />
//       </div>
//     )
//   }
// }

// export function EditableContacts({
//   contactKVs,
//   setContactKV,
//   removeContactKV,
// }: {
//   contactKVs: Record<string, string | undefined>
//   setContactKV: (contactType: ContactType, contactValue?: string) => void
//   removeContactKV: (contactType: ContactType) => void
// }) {
//   const [editingContactType, setEditingContactType] =
//     useState<ContactType | null>(null)

//   useEffect(() => {
//     if (editingContactType === null) {
//       for (const [contactType, contactValue] of Object.entries(contactKVs)) {
//         if (!contactValue) {
//           removeContactKV(contactType as ContactType)
//         }
//       }
//     }
//   }, [editingContactType, contactKVs, removeContactKV])

//   function getAddableContactTypes() {
//     return [...Object.keys(contactTypes)]
//       .filter(contactType => {
//         return !(contactType in contactKVs)
//       })
//       .map((contactType, i) => {
//         return (
//           <AddButton
//             key={i}
//             onClick={() => {
//               setEditingContactType(contactType as ContactType)
//               setContactKV(contactType as ContactType, "")
//             }}
//             label={contactType}
//           />
//         )
//       })
//   }

//   return (
//     <ul className="flex flex-col gap-2">
//       {Object.entries(contactKVs).map(([contactType, contactValue]) => (
//         <EditableContactItem
//           key={contactType}
//           contactType={contactType as ContactType}
//           {...{
//             contactValue,
//             editingContactType,
//             setEditingContactType,
//             setContactKV,
//             removeContactKV,
//           }}
//         />
//       ))}
//       {getAddableContactTypes()}
//     </ul>
//   )
// }

// function EditableContactItem({
//   editingContactType,
//   setEditingContactType,
//   contactType,
//   contactValue,
//   setContactKV,
//   removeContactKV,
//   initialKVs,
//   slug,
// }: {
//   editingContactType: ContactType | null
//   setEditingContactType: (contactType: ContactType | null) => void
//   contactType: ContactType
//   contactValue?: string
//   setContactKV: (contactType: ContactType, contactValue?: string) => void
//   removeContactKV: (contactType: ContactType) => void
//   initialKVs: React.MutableRefObject<Partial<Record<ContactType, string>>>
//   slug: string
// }) {
//   const room = useRoom(slug)

//   function updateContact(contactType: ContactType, contactValue: string) {
//     const content: OrganMetaContactUnstable = {
//       type: contactType,
//       value: contactValue,
//     }
//     if (
//       !(contactType in initialKVs.current) ||
//       contactValue !== initialKVs.current[contactType]
//     ) {
//       room
//         ?.sendStateEvent(organMetaContactUnstable, content, contactType)
//         .then(() => {
//           initialKVs.current[contactType] = contactValue
//         })
//     }
//   }

//   const [currentContactValue, setCurrentContactValue] = useState(contactValue)
//   if (contactType === editingContactType)
//     return (
//       <li className="flex items-center gap-1">
//         {getIcon(contactType)} <label>{contactType}</label>
//         <input
//           autoFocus
//           value={currentContactValue}
//           onChange={e => {
//             setCurrentContactValue(e.target.value)
//             setContactKV(contactType, e.target.value)
//           }}
//         />
//         <DoneButton onClick={() => setEditingContactType(null)} />
//       </li>
//     )
//   else
//     return (
//       <li className="flex items-center gap-1">
//         <ContactItem {...{ contactType, contactValue }} />
//         <EditButton
//           alt="Edit links"
//           onClick={() => setEditingContactType(contactType)}
//         />
//         <DeleteButton
//           onClick={() => {
//             removeContactKV(contactType)
//             setEditingContactType(null)
//           }}
//         />
//       </li>
//     )
// }
