export function Pre(props: { children: React.ReactNode }) {
  return (
    <pre className="p-2 my-4 overflow-scroll font-mono text-xs border rounded bg-stone-100 border-stone-300">
      {props.children}
    </pre>
  )
}
