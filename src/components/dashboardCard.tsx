/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { truncate } from "lodash";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Project } from "@team-golfslag/conflux-api-client/src/client";
import { Link } from "react-router";
import { JSX } from "react";

export interface DashboardCardProps {
  project: Project;
  role: string;
}

const DashboardCard = ({ project, role }: DashboardCardProps): JSX.Element => {
  return (
    <Card className="m-3 flex h-60 flex-col gap-0 py-0 pt-6 shadow-md">
      <CardHeader className="bg-gray-100 p-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {project.title}
        </h4>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col p-4 wrap-break-word">
        {/* Project Description (truncated if too long) */}
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {truncate(project.description, {
            length: 100,
            separator: " ",
            omission: "...",
          })}
        </p>
        <div className="flex-grow"></div>
        <div className="flex justify-end">
          <p className="text-sm leading-7 text-gray-500 [&:not(:first-child)]:mt-6">
            Roles: {role}
          </p>
          <div className="flex-grow"></div>
          <Link to={`/projects/${project.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
