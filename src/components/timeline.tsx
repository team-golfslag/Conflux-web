/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

export type TimelineItem = { date: string, name: string }
type TimelineProps = { items: TimelineItem[] }

/**
 * Timeline component
 * @param props the list of timeline items to be displayed
 */
const Timeline = (props: TimelineProps) => {
    return (
        <div className="relative border-l-2 border-gray-300 pl-4">
            {props.items.map((item, index) => (
                <div key={index} className="relative mb-6">
                    <div className="absolute -left-6.75 top-1 w-5 h-5 bg-gray-400 rounded-full"></div>
                    <p className="text-gray-400 pt-1 text-sm">{item.date}</p>
                    <p className="text-xl font-semibold text-black">{item.name}</p>
                </div>
            ))}
        </div>
    );
};

export default Timeline;