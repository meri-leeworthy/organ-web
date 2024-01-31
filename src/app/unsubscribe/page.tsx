import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Unsubscribe({ params }: { params: { slug: string } }) {
  const { slug } = params
  return (
    <Card className="flex flex-col gap-4 max-w-md w-full">
      <CardHeader>
        <h1>Unsubscribe</h1>
      </CardHeader>
      <CardContent>
        <p>This doesn&apos;t work yet</p>
        <form className="flex flex-col gap-2">
          <Input placeholder="your.email@address.com" />
          <Input placeholder="room id" />
          <Button>Unsubscribe</Button>
        </form>
      </CardContent>
    </Card>
  )
}
