"use client"

import { FlexGridListItem } from "@/components/ui/FlexGridList"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getContextualDate } from "@/lib/utils"
import Link from "next/link"

export type Child = {
  roomId: string
  name: string
  topic: string
  roomType: string
  pageType: string
  alias?: string
  eventMeta?: any
}

export function EventsCarousel({ tagChildren }: { tagChildren: Child[] }) {
  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
      }}>
      <CarouselContent>
        {tagChildren?.map((child: any) => {
          return (
            <CarouselItem
              key={child.roomId + Math.random()}
              className="basis-1/3">
              <EventCarouselItem event={child} />
            </CarouselItem>
          )
        })}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} />
      <CarouselNext variant={"ghost"} />
    </Carousel>
  )
}

function EventCarouselItem({ event }: { event: Child }) {
  const date = getContextualDate(parseInt(event.eventMeta.start))
  return (
    <Link href={``} key={event.roomId}>
      <FlexGridListItem>
        <time className="text-xs uppercase">{date}</time>
        <h3 className="font-medium py-1">{event.name}</h3>
        <p>{event.topic}</p>
      </FlexGridListItem>
    </Link>
  )
}
