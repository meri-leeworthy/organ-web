import { EmailSubscribe } from "@/components/ui/EmailSubscribe"

export default function Notifications({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  return (
    <div className="flex flex-col gap-4">
      <h1>Notification Settings</h1>
      <EmailSubscribe slug={slug} />
    </div>
  )
}
