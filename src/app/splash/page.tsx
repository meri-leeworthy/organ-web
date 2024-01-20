import {
  IconCalendarEvent,
  IconCursorOff,
  IconFlag,
  IconHandClick,
  IconHeart,
  IconMoneybag,
  IconNorthStar,
  IconUsersGroup,
} from "@tabler/icons-react"

export default function Splash() {
  return (
    <div className="flex flex-col items-center w-screen min-h-screen">
      <div className="flex flex-col w-60 h-72">
        <p className="w-32 mb-4 text-xs text-primarydark">
          the new platform by radical directory,
        </p>
        <h1 className="text-2xl font-black leading-4">organ</h1>
        <p className="self-end mt-2 italic">is finally</p>
        <p className="flex items-center gap-1 mt-4 self-start px-3 py-1 ml-8 rounded-[100%]  border-2 border-black border-dashed">
          <IconNorthStar size={20} /> ready
        </p>
        <p className="self-end w-24 p-2 mt-6 mr-8 text-xs text-right underline uppercase rounded opacity-80 decoration-primarydark">
          for some people to try using it
        </p>
      </div>
      <div className="flex flex-col p-4 mt-16 bg-white border rounded-lg w-60 h-72 drop-shadow-sm">
        <h1 className="text-2xl font-black leading-4">organ</h1>
        <p className="self-end w-40 mt-4 text-xs italic text-right">
          is an open-source, decentralised platform designed for{" "}
          <u className="decoration-primarydark">grassroots political media</u>
        </p>
        <p className="self-start mt-4 text-sm uppercase">focused on...</p>
        <div className="flex flex-wrap items-end self-end justify-end gap-2 mt-4 text-xs">
          <p className="flex items-center gap-1 self-end px-3 py-1 ml-8 rounded-[100%] bg-primary">
            <IconUsersGroup size={20} /> Collective
          </p>
          <p className="flex self-end items-center gap-1 px-3 py-1 ml-8 rounded-[100%] bg-primary">
            <IconCalendarEvent size={20} /> Action
          </p>{" "}
          and
          <p className="flex items-center gap-1 self-end px-3 py-1 ml-8 rounded-[100%] bg-primary">
            <IconFlag size={20} /> Autonomy
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-16 w-72 h-72">
        <p className="flex items-center self-start gap-1 px-2 mb-4 text-xs rounded-full bg-primary">
          you can help!{" "}
        </p>
        <h1 className="flex items-center gap-2 text-2xl font-black leading-4 ">
          organisers
        </h1>
        <p className="self-center mt-8 text-xs italic text-primarydark">
          by trying to
        </p>
        <p className="flex items-center self-center gap-1 mt-2 font-medium">
          <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full drop-shadow-sm">
            <IconHandClick size={12} />
            Create Account,
          </div>{" "}
          <span className="self-end ml-1 text-xs font-normal uppercase opacity-70">
            then
          </span>
        </p>
        {/* <p className="self-start mt-2 ml-8 mr-8 text-xs uppercase rounded opacity-80 text-primarydark">
          then
        </p> */}
        <p className="flex items-center self-center gap-1 px-2 py-1 mt-2 font-medium bg-white rounded-full drop-shadow-sm">
          <IconHandClick size={12} />
          Create New Page
        </p>
        <p className="self-end w-32 p-2 mt-6 text-xs text-right uppercase rounded opacity-80 ">
          for your group, try posting etc, and giving feedback
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-16 italic w-72 h-72">
        <p className="w-40 text-xs">
          this is not yet a secure or encrypted platform, but working towards
          that is the goal. (and hopefully video, livestreams, wikis, p2p
          networking...)
        </p>
        <p className="w-40 ml-4 text-xs">
          i&apos;ve been working hard on this for ages and really hope it can be
          helpful to our movements. your support means a lot to me!
        </p>
        <IconHeart size={12} />
      </div>
    </div>
  )
}
