/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { JSX } from "react";
import { Label } from "@/components/ui/label.tsx";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/datepicker.tsx";

export interface ProjectDatesProps {
  editMode: boolean;
  start_date?: Date;
  end_date?: Date;
  setSelectedStartDate?: (date: Date | undefined) => void;
  setSelectedEndDate?: (date: Date | undefined) => void;
}

export default function ProjectDates({
  editMode,
  start_date,
  end_date,
  setSelectedStartDate,
  setSelectedEndDate,
}: Readonly<ProjectDatesProps>): JSX.Element {
  return (
    <>
      {editMode ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-date" className="font-semibold">
              Start Date
            </Label>
            <DatePicker
              className="mt-1 flex flex-nowrap gap-2 overflow-visible pr-1"
              buttonClassName="w-full max-w-[calc(100%-44px)]"
              initialDate={start_date}
              onDateChange={setSelectedStartDate}
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="font-semibold">
              End Date
            </Label>
            <DatePicker
              className="mt-1 flex flex-nowrap gap-2 overflow-visible pr-1"
              buttonClassName="w-full max-w-[calc(100%-44px)]"
              initialDate={end_date}
              onDateChange={setSelectedEndDate}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-date" className="font-semibold">
              Start Date
            </Label>
            <p className="pt-1 pb-2 text-gray-700">
              {start_date ? format(start_date, "d MMMM yyyy") : "N/A"}
            </p>
          </div>

          <div>
            <Label htmlFor="end-date" className="font-semibold">
              End Date
            </Label>
            <p className="pt-1 pb-2 text-gray-700">
              {end_date ? format(end_date, "d MMMM yyyy") : "N/A"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
