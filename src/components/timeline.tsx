/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { CollapsibleContent } from "@/components/ui/collapsible.tsx";

export type TimelineItem = {
  date: string;
  name: string;
  importance: TimeLineImportance;
};
type TimelineProps = { items: TimelineItem[] };
export enum TimeLineImportance {
  Low,
  Medium,
  High,
}

/**
 * Timeline component
 * @param props the list of timeline items to be displayed
 */
const Timeline = (props: TimelineProps) => {
  return (
    <div className="relative ml-32 border-l-2 border-gray-200 pl-4">
      {props.items.map((item) => (
        <div key={item.name} className="relative mb-4">
          {" "}
          {/* TODO a unique key is required for each item */}
          {item.importance === TimeLineImportance.High && (
            <div className="py-1">
              <div className="absolute top-2 -left-6.75 h-5 w-5 rounded-full bg-gray-200"></div>
              <p className="absolute -left-32 py-1 text-sm text-gray-500">
                {item.date}
              </p>
              <p className="pl-1 text-lg font-semibold text-black">
                {item.name}
              </p>
            </div>
          )}
          {item.importance !== TimeLineImportance.High && (
            <CollapsibleContent>
              <div className="absolute top-1 -left-6.25 h-4 w-4 rounded-full bg-gray-200"></div>
              <p className="absolute -left-32 text-sm text-gray-400">
                {item.date}
              </p>
              <p className="pl-2 text-sm text-gray-700">Some log item</p>
            </CollapsibleContent>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
