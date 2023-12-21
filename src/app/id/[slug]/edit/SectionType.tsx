export const sections = {
  title: "title",
  description: "description",
  contact: "contact",
} as const

export type SectionType = keyof typeof sections | null
