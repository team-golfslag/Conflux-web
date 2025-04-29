/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
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
    <Card className="m-3 flex h-64 flex-col gap-0 py-0 shadow-md">
      <CardHeader className="rounded-t-xl bg-gray-100 px-4 py-2">
        <h4 className="line-clamp-3 scroll-m-20 text-xl font-semibold tracking-tight">
          {project.title}
        </h4>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col p-4 wrap-break-word">
        {/* Project Description (clamped if too long) */}
        <p className="line-clamp-3 leading-7 [&:not(:first-child)]:mt-6">
          {project.description}
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
