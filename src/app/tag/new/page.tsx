import { IfLoggedIn } from "@/components/IfLoggedIn"

const { NODE_ENV, HOME_SPACE } = process.env

export default async function ApplicationServiceTest() {
  console.log("NODE_ENV", NODE_ENV)

  return <IfLoggedIn>{NODE_ENV === "development" && <h1>hello</h1>}</IfLoggedIn>
}
