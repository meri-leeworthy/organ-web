"use client"

import { Child } from "@/lib/getChild"
import { FlexGridListItem } from "@/components/ui/FlexGridList"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getContextualDate, getIdLocalPart } from "@/lib/utils"
import Link from "next/link"

export function ChildrenCarousel({
  spaceChildren,
}: {
  spaceChildren: Child[]
}) {
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
      }}>
      <CarouselContent>
        {spaceChildren?.map((child: any) => {
          return (
            <CarouselItem key={child.roomId + Math.random()} className="">
              <CarouselChild child={child} />
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} />
      <CarouselNext variant={"ghost"} />
    </Carousel>
  )
}

function CarouselChild({ child }: { child: Child }) {
  const date =
    "eventMeta" in child && getContextualDate(parseInt(child.eventMeta!.start))
  const link =
    "eventMeta" in child
      ? `/event/${getIdLocalPart(child.roomId)}`
      : `/id/${child.alias?.split("#relay_id_")[1].split(":")[0]}`
  return (
    <Link href={link} key={child.roomId}>
      <FlexGridListItem>
        {date && <time className="text-xs uppercase">{date}</time>}
        <h3 className="font-special font-bold text-base">{child.name}</h3>
        <p className="text-sm">{child.topic}</p>
      </FlexGridListItem>
    </Link>
  )
}
