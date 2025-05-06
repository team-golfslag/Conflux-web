/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Timeline, { TimelineItem } from "@/components/timeline.tsx";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";

type ProjectTimelineProps = { timelineData: TimelineItem[] };

export default function ProjectTimeline({
  timelineData,
}: Readonly<ProjectTimelineProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
        <CardHeader className="relative flex justify-between">
          <CardTitle>Timeline</CardTitle>
          <div className="absolute top-2.5 right-0 flex items-center justify-between space-x-4 px-4">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="group bg-primary text-primary-foreground hover:bg-accent hover:text-gray-700"
              >
                <span className="text-primary-foreground transition-colors duration-200 group-hover:text-gray-700">
                  {isOpen ? "Collapse" : "Expand"}
                </span>
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <div className="mt-4 ml-3 space-y-4">
          <Timeline items={timelineData} />
        </div>
      </Collapsible>
    </Card>
  );
}
