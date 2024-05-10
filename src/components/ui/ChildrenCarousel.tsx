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
import { Suspense } from "react"

export function ChildrenCarousel({
  spaceChildren,
}: {
  spaceChildren: Child[]
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
    </Suspense>
  )
}

function CarouselChild({ child }: { child: Child }) {
  const date =
    "eventMeta" in child && getContextualDate(parseInt(child.eventMeta!.start))
  const link =
    "roomType" in child && child.roomType === "event"
      ? `/event/${getIdLocalPart(child.roomId)}`
      : "roomType" in child && child.roomType === "page"
      ? `/id/${child.alias?.split("#relay_id_")[1].split(":")[0]}`
      : "roomType" in child && child.roomType === "tag"
      ? `/tag/${child.alias?.split("#relay_tag_")[1].split(":")[0]}`
      : ""

  // console.log("child", child)

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
