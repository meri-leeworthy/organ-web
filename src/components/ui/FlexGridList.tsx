export function FlexGridList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-wrap gap-2">{children}</ul>
}

export function FlexGridListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="my-4 w-full pt-1 sm:w-80 relative group transition list-none">
      <div className="absolute inset-0 border-t border-green-400 transition group-hover:border-t-4"></div>
      <div className="relative z-10">{children}</div>
    </li>
  )
}

export function FlexList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col items-start gap-6">{children}</ul>
}

export function FlexListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="pl-3 w-full relative group transition max-w-xl">
      <div className="absolute inset-0 border-l-2 border-green-400 transition group-hover:border-l-4"></div>
      <div className="relative z-10">{children}</div>
    </li>
  )
}
