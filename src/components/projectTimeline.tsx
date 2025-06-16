/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Timeline, { TimelineItem } from "@/components/timeline.tsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";

type ProjectTimelineProps = { timelineData: TimelineItem[] };

export default function ProjectTimeline({
  timelineData,
}: Readonly<ProjectTimelineProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="relative flex items-baseline justify-between">
          <CardTitle>Timeline</CardTitle>
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="group hover:bg-accent hover:text-gray-700"
              >
                <span className="transition-colors duration-200 group-hover:text-gray-700">
                  {isOpen ? "Collapse" : "Expand"}
                </span>
                {isOpen && <ChevronUp className="h-4 w-4" />}
                {!isOpen && <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <div className="mt-4 ml-3">
          <Timeline items={timelineData} />
        </div>
      </Collapsible>
    </Card>
  );
}
