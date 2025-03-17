import React from "react";

export class TimelineItem {
  date: string = '';
  name: string = '';
}

interface TimelineProps {
  items: TimelineItem[];
}


const Timeline: React.FC<TimelineProps> = ({ items }) => {
    return (
    <div className="relative border-l-2 border-gray-300 pl-4">
      {items.map((item, index) => (
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
