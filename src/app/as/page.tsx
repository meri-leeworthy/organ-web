import { IfLoggedIn } from "@/components/IfLoggedIn"
import {
  JoinRoom,
  Register,
  GetRooms,
  CreateMailbox,
  SetSecret,
  GetSecret,
} from "./Forms"
const { NODE_ENV, HOME_SPACE } = process.env

export default async function ApplicationServiceTest() {
  console.log("NODE_ENV", NODE_ENV)

  return (
    <IfLoggedIn>
      {NODE_ENV === "development" && (
        <div className="max-w-lg">
          <h1>Application Service Test</h1>

          <p>Home space: {HOME_SPACE}</p>

          <h2>Get Rooms</h2>
          <GetRooms />

          <h2>Join Room</h2>
          <JoinRoom />

          <h2>Register User</h2>
          <Register />

          <h2>Create Mailbox Room</h2>
          <CreateMailbox />

          <h2>Set Secret</h2>
          <SetSecret />

          <h2>Get Secret</h2>
          <GetSecret />
        </div>
      )}
    </IfLoggedIn>
  )
}
