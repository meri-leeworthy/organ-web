import { IfLoggedIn } from "@/components/IfLoggedIn"
import { JoinRoom, Register, GetRooms } from "./Forms"

export default async function ApplicationServiceTest() {
  return (
    <IfLoggedIn>
      <h1>Application Service Test</h1>

      <h2>Get Rooms</h2>
      <GetRooms />

      <h2>Join Room</h2>
      <JoinRoom />

      <h2>Register User</h2>
      <Register />
    </IfLoggedIn>
  )
}
