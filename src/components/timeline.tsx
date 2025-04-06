/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

export type TimelineItem = { date: string; name: string };
type TimelineProps = { items: TimelineItem[] };

/**
 * Timeline component
 * @param props the list of timeline items to be displayed
 */
const Timeline = (props: TimelineProps) => {
  return (
    <div className="relative border-l-2 border-gray-300 pl-4">
      {props.items.map((item) => (
        <div key={item.name} className="relative mb-6">
          {" "}
          {/* TODO a unique key is required for each item */}
          <div className="absolute top-1 -left-6.75 h-5 w-5 rounded-full bg-gray-400"></div>
          <p className="pt-1 text-sm text-gray-400">{item.date}</p>
          <p className="text-xl font-semibold text-black">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
