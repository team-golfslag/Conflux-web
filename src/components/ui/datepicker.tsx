"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
    id?: string
    value?: Date
    onChange?: (d?: Date) => void
    disabled?: boolean
}



function DatePicker({onChange, value, id, disabled}: DatePickerProps) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    defaultMonth={value}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export {DatePicker}
export type { DatePickerProps }
