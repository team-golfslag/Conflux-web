/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { truncate } from "lodash";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Collaboration } from "@/types/collaboration.ts";

const dashboardCard = (project: Collaboration, index: number) => {
  <Card key={index} className="flex flex-col shadow-md">
    <CardHeader className="rounded-t-md bg-gray-100 p-4">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {project.collaboration_group.display_name}
      </h4>
    </CardHeader>
    <CardContent className="flex flex-grow flex-col p-4">
      {/* Project Description (truncated if too long) */}
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {truncate(project.collaboration_group.description, {
          length: 100,
          separator: " ",
          omission: "...",
        })}
      </p>
      <div className="flex-grow"></div>
      <div className="flex justify-end">
        <p className="text-sm leading-7 text-gray-500 [&:not(:first-child)]:mt-6">
          Role: not available
        </p>
        <div className="flex-grow"></div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </CardContent>
  </Card>;
};

export default dashboardCard;
