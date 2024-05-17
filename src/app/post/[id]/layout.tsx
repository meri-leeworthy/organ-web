export default function PostLayout({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode
}) {
  return <div className="z-10 mt-10 flex flex-col items-center">{children}</div>
}
