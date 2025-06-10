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
  onDateChange?: (date: Date | undefined) => void;
  initialDate?: Date;
  className?: string;
  buttonClassName?: string;
}

/**
 * DatePicker component with added month and year selection.
 * Years are infinitely scrollable with dynamic loading to prevent large lists.
 * @param onDateChange Callback function to handle date changes
 * @param initialDate The initial date to be displayed in the date picker
 */
export function DatePicker({
  onDateChange,
  initialDate,
  className = "",
  buttonClassName = "",
}: Readonly<DatePickerProps>) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [currentMonthView, setCurrentMonthView] = React.useState<Date>(
    initialDate || new Date(),
  );
  
  // State for infinite scrolling years - maintain a sliding window
  const [yearRange, setYearRange] = React.useState<{ start: number; end: number }>(() => {
    const currentYear = initialDate ? getYear(initialDate) : getYear(new Date());
    return {
      start: currentYear - 25,  // Smaller initial range
      end: currentYear + 25
    };
  });

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

  // Generate years dynamically based on current range
  const years = React.useMemo(() => {
    return Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, i) => yearRange.start + i,
    );
  }, [yearRange]);

  // Function to extend year range when scrolling - no caps, but keep range manageable
  const extendYearRange = React.useCallback((direction: 'up' | 'down') => {
    setYearRange(prev => {
      if (direction === 'up') {
        return {
          start: prev.start - 25,  // Add 25 years backwards
          end: prev.end - 10       // Remove some from the end to keep total size reasonable
        };
      } else if (direction === 'down') {
        return {
          start: prev.start + 10,  // Remove some from the start
          end: prev.end + 25       // Add 25 years forwards
        };
      }
      return prev;
    });
  }, []);

  // Throttle scroll events to prevent excessive updates
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const target = e.target as HTMLDivElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      
      // Load more years when scrolling near the top (no lower bound)
      if (scrollTop < 100) {
        extendYearRange('up');
      }
      
      // Load more years when scrolling near the bottom (no upper bound)
      if (scrollTop + clientHeight > scrollHeight - 100) {
        extendYearRange('down');
      }
    }, 150); // 150ms throttle
  }, [extendYearRange]);

  // Function to ensure current year is in range
  const ensureYearInRange = React.useCallback((year: number) => {
    setYearRange(prev => {
      const needsExpansion = year < prev.start || year > prev.end;
      if (!needsExpansion) return prev;
      
      // Center the range around the target year
      return {
        start: year - 25,
        end: year + 25
      };
    });
  }, []);

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

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
              onOpenChange={(open) => {
                if (open) {
                  // Ensure current year is visible when opening
                  const currentYear = getYear(currentMonthView);
                  ensureYearInRange(currentYear);
                }
              }}
            >
              <SelectTrigger className="w-[110px] cursor-pointer transition-colors duration-200 hover:bg-slate-100">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <div 
                  className="max-h-60 overflow-y-auto"
                  onScroll={handleScroll}
                >
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </div>
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
