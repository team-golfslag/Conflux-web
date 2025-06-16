/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { CollapsibleContent } from "@/components/ui/collapsible.tsx";
import { format } from "date-fns";
import { ITimelineItemResponseDTO } from "@team-golfslag/conflux-api-client/src/client";

export type TimelineItem = ITimelineItemResponseDTO;
type TimelineProps = { items: TimelineItem[] };

/**
 * Timeline component
 * @param props the list of timeline items to be displayed
 */
const Timeline = (props: TimelineProps) => {
  return (
    <div className="relative ml-32 border-l-2 border-gray-200 pr-4 pl-4">
      {props.items.map((item, index) => (
        <div key={index} className="relative mb-4">
          {item.is_milestone && (
            <div className="py-1">
              <div className="absolute top-2 -left-6.75 h-5 w-5 rounded-full bg-gray-200"></div>
              <p className="absolute -left-32 py-1 text-sm text-gray-500">
                {item.date instanceof Date
                  ? format(item.date, "dd-MM-yyyy")
                  : format(new Date(item.date), "dd-MM-yyyy")}
              </p>
              <p className="pr-4 pl-1 text-lg font-semibold text-black">
                {item.short_description}
              </p>
            </div>
          )}
          {!item.is_milestone && (
            <CollapsibleContent>
              <div className="absolute top-1 -left-6.25 h-4 w-4 rounded-full bg-gray-200"></div>
              <p className="absolute -left-32 text-sm text-gray-400">
                {item.date instanceof Date
                  ? format(item.date, "dd-MM-yyyy")
                  : format(new Date(item.date), "dd-MM-yyyy")}
              </p>
              <p className="pr-4 pl-2 text-sm text-gray-700">
                {item.short_description}
              </p>
              {item.description && (
                <p className="mt-1 pr-4 pl-2 text-xs text-gray-500">
                  {item.description}
                </p>
              )}
            </CollapsibleContent>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
