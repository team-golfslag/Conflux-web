/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
"use client";

import * as React from "react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  onDateChange?: (date: Date | undefined) => void;
  initialDate?: Date;
  className?: string;
  buttonClassName?: string;
}

/**
 * DatePicker component with added month and year selection.
 * @param startYear The starting year for the year selection
 * @param endYear The ending year for the year selection
 * @param onDateChange Callback function to handle date changes
 * @param initialDate The initial date to be displayed in the date picker
 */
export function DatePicker({
  startYear = getYear(new Date()) - 20,
  endYear = getYear(new Date()) + 20,
  onDateChange,
  initialDate,
  className = "",
  buttonClassName = "",
}: Readonly<DatePickerProps>) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [currentMonthView, setCurrentMonthView] = React.useState<Date>(
    initialDate || new Date(),
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const handleMonthChange = (month: string) => {
    const newMonthView = setMonth(currentMonthView, months.indexOf(month));
    setCurrentMonthView(newMonthView);
  };

  const handleYearChange = (year: string) => {
    const newMonthView = setYear(currentMonthView, parseInt(year));
    setCurrentMonthView(newMonthView);
  };

  const handleSelect = (selectedData: Date | undefined) => {
    setDate(selectedData);
    onDateChange?.(selectedData);
    if (selectedData) {
      setCurrentMonthView(selectedData);
    }
  };

  const handleMonthNavigate = (newMonthDate: Date) => {
    setCurrentMonthView(newMonthDate);
  };

  React.useEffect(() => {
    setDate(initialDate);
    setCurrentMonthView(initialDate || new Date());
  }, [initialDate]);

  return (
    <div className={cn(className)}>
      <Popover>
        <PopoverTrigger asChild className="cursor-pointer">
          <Button
            variant={"outline"}
            className={cn(
              "w-[210px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              buttonClassName,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex justify-between p-2">
            <Select
              onValueChange={handleMonthChange}
              value={months[getMonth(currentMonthView)]}
            >
              <SelectTrigger className="w-[110px] cursor-pointer transition-colors duration-200 hover:bg-slate-100">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYearChange}
              value={getYear(currentMonthView).toString()}
            >
              <SelectTrigger className="w-[110px] cursor-pointer transition-colors duration-200 hover:bg-slate-100">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={currentMonthView}
            onMonthChange={handleMonthNavigate}
          />
        </PopoverContent>
        {date && (
          <Button
            variant="ghost"
            className="text-muted-foreground mx-2 cursor-pointer"
            size="sm"
            onClick={() => {
              setDate(undefined);
              onDateChange?.(undefined);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </Popover>
    </div>
  );
}
