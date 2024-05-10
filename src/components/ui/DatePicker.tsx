/* eslint-disable @next/next/no-img-element */
"use client"
import { Dispatch, SetStateAction } from "react"
import { IconCalendar } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button as SCNButton } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar } from "./calendar"
import { format } from "date-fns"

export function DatePicker({
  startDate,
  setStartDate,
}: {
  startDate: Date | undefined
  setStartDate: Dispatch<SetStateAction<Date | undefined>>
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <SCNButton
          variant={"outline"}
          size="sm"
          className={cn(
            "w-56 border-primary text-base justify-start text-opacity-100 text-left font-normal rounded-none shadow-none hover:bg-primary",
            !startDate && "text-[#8258ff] text-opacity-50"
          )}>
          <IconCalendar className="mr-2 h-4 w-4" />
          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
        </SCNButton>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={startDate}
          onSelect={setStartDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
