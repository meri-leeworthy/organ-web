import { IfLoggedIn } from "@/components/IfLoggedIn"
import { JoinRoom, Register, GetRooms } from "./Forms"
const { NODE_ENV } = process.env

export default async function ApplicationServiceTest() {
  console.log("NODE_ENV", NODE_ENV)

  return (
    <IfLoggedIn>
      {NODE_ENV === "development" && (
        <>
          <h1>Application Service Test</h1>

          <h2>Get Rooms</h2>
          <GetRooms />

          <h2>Join Room</h2>
          <JoinRoom />

          <h2>Register User</h2>
          <Register />
        </>
      )}
    </IfLoggedIn>
  )
}
