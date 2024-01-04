import {
  // IconBrandFacebook,
  // IconBrandLinktree,
  // IconNews,
  // IconBrandInstagram,
  // IconBrandTwitter,
  // IconMail,
  // IconWorld,
  IconLink,
} from "@tabler/icons-react"
import { ContactType } from "@/lib/types"

export function Contact({
  contactKVs,
}: {
  contactKVs: Record<ContactType, string[] | undefined>
}) {
  return (
    <ul className="text-sm flex items-start flex-col justify-start">
      {/* {Object.entries(contactKVs).map(([contactType, contactValue]) => (
        <li key={contactType}>
          <ContactItem
            contactType={contactType as ContactType}
            contactValue={contactValue}
          />
        </li>
      ))} */}
      {contactKVs.link?.map((link, i) => (
        <li key={link}>
          <ContactItem
            contactType="link"
            contactValue={contactKVs.link}
            i={i}
          />
        </li>
      ))}
    </ul>
  )
}

export function ContactItem({
  contactType,
  contactValue,
  i,
}: {
  contactType: ContactType
  contactValue: string[] | undefined
  i: number
}) {
  if (!contactValue) return null
  if (!contactValue[i]) return null
  const link = contactValue[i]
  const truncatedLink = link.includes("://")
    ? link.split("://")[1]
    : link.includes("mailto:")
    ? link.split("mailto:")[1]
    : link
  return (
    <a href={contactValue && contactValue[i]}>
      <div className="flex rounded-full uppercase opacity-70 text-xs p-1 justify-start items-center gap-1 overflow-hidden">
        <div className="text-black">{getIcon(contactType)} </div>
        {getLabel(contactType, truncatedLink || "")}
      </div>
    </a>
  )
}

export function getIcon(contactType: ContactType) {
  switch (contactType) {
    case "link":
      return <IconLink size={16} />
    // case "email":
    //   return <IconMail size={16} />
    // case "website":
    //   return <IconWorld size={16} />
    // case "twitter":
    //   return <IconBrandTwitter size={16} />
    // case "instagram":
    //   return <IconBrandInstagram size={16} />
    // case "facebook":
    //   return <IconBrandFacebook size={16} />
    // case "newsletter":
    //   return <IconNews size={16} />
    // case "linktree":
    //   return <IconBrandLinktree size={16} />
  }
}

export function getHrefFormat(contactType: ContactType, contactValue?: string) {
  if (!contactValue) return ""
  switch (contactType) {
    case "link":
      return contactValue
    // case "email":
    //   return `mailto:${contactValue}`
    // case "website":
    //   return contactValue
    // case "twitter":
    //   return `https://twitter.com/${contactValue.split("@")[1]}`
    // case "instagram":
    //   return `https://instagram.com/${contactValue.split("@")[1]}`
    // case "facebook":
    //   return `https://facebook.com/${contactValue.split("/")[1]}`
    // case "newsletter":
    //   return contactValue
    // case "linktree":
    //   return contactValue
  }
}

export function getLabel(contactType: ContactType, contactValue?: string) {
  if (!contactValue) return "loading..."
  switch (contactType) {
    case "link":
      return contactValue
    // case "email":
    //   return contactValue
    // case "website":
    //   return contactValue
    // case "twitter":
    //   return contactValue.split("@")[1]
    // case "instagram":
    //   return contactValue.split("@")[1]
    // case "facebook":
    //   return contactValue.split("/")[1]
    // case "newsletter":
    //   return "Newsletter"
    // case "linktree":
    //   return "Linktree"
  }
}
