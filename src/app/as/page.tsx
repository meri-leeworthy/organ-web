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
const { NODE_ENV, HOME_SPACE, TAG_INDEX } = process.env

export default async function ApplicationServiceTest() {
  console.log("NODE_ENV", NODE_ENV)

  return (
    <IfLoggedIn>
      {NODE_ENV === "development" && (
        <div className="max-w-lg">
          <h1>Application Service Test</h1>

          <p>Home space: {HOME_SPACE}</p>
          <p>Tag index: {TAG_INDEX}</p>

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

          <h2>Seed Data</h2>
          <p>
            Create _relay_bot user
            <br />
            Create tag index space <br />
            Set #relay_tagindex:localhost as alias for tag index space <br />
            Create 50 tags <br />
            Create 50 ID pages <br />
            Create 200 event pages <br />
            Create 500 posts <br />
            Create 1000 users <br />
            Join each user to: <br />
            10 random tags, <br />
            10 random ID pages, <br />
            50 random event pages. <br />
            Join each event page to: <br />
            1 or 2 random ID pages, <br />
            5 random tags. <br />
            Join each ID page to: <br />5 random tags.
          </p>
        </div>
      )}
    </IfLoggedIn>
  )
}
