import { Suspense } from "react"
import { Button } from "../styled"
import { IfLoggedIn } from "../IfLoggedIn"
import { Dialog, DialogContent, DialogTrigger } from "./dialog"
import { LoginForm } from "./LoginForm"
import { handleLogout } from "@/lib/handleLogout"

export default function LoginLogout() {
  return (
    <Suspense fallback={<Login />}>
      <IfLoggedIn fallback={<Login />}>
        <Logout />
      </IfLoggedIn>
    </Suspense>
  )
}

function Login() {
  return (
    <Dialog>
      <DialogTrigger className="text-sm">login</DialogTrigger>
      <DialogContent>
        <LoginForm />
      </DialogContent>
    </Dialog>
  )
}

function Logout() {
  return <Button onClick={handleLogout}>logout</Button>
}
