import { IfLoggedIn } from "@/components/IfLoggedIn"
import { Form } from "./Form"
import Link from "next/link"

const { NODE_ENV } = process.env

export default async function NewTag() {
  console.log("NODE_ENV", NODE_ENV)

  if (NODE_ENV !== "development") return null

  return (
    <IfLoggedIn>
      <h1>New Post</h1>
      <Form />
      {/* <Link href="/tag/list">List Tags</Link> */}
    </IfLoggedIn>
  )
}
