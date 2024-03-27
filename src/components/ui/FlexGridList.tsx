export function FlexGridListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="my-4 w-80 border-t border-green-400 hover:border-t-4">
      {children}
    </li>
  )
}

export function FlexGridList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-wrap gap-2">{children}</ul>
}
