import { IfLoggedIn } from "@/components/IfLoggedIn"
import {
  JoinRoom,
  Register,
  GetRooms,
  CreateMailbox,
  SetSecret,
  GetSecret,
  GetState,
  SetState,
  GetStateType,
  SendMessage,
  GetAliases,
  GetRoomIdFromAlias,
  SetAlias,
  CreateRoom,
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

          <h2>Create Room</h2>
          <CreateRoom />

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

          <h2>Get State</h2>
          <GetState />

          <h2>Get State Type</h2>
          <GetStateType />

          <h2>Set State</h2>
          <SetState />

          <h2>Send Message</h2>
          <SendMessage />

          <h2>Get Aliases for Room</h2>
          <GetAliases />

          <h2>Get RoomId from Alias</h2>
          <GetRoomIdFromAlias />

          <h2>Set Alias</h2>
          <SetAlias />
        </div>
      )}
    </IfLoggedIn>
  )
}
