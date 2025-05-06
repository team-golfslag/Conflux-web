/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Project } from "@team-golfslag/conflux-api-client/src/client";
import { Link } from "react-router-dom";
import { JSX } from "react";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProjectCardProps {
  project: Project;
  role?: string;
}

const ProjectCard = ({ project, role }: ProjectCardProps): JSX.Element => {
  // Format dates for display
  const startDate = project.start_date
    ? new Date(project.start_date).toLocaleDateString()
    : "No start date";
  const endDate = project.end_date
    ? new Date(project.end_date).toLocaleDateString()
    : "Ongoing";

  // Determine project status
  const getStatus = () => {
    const now = new Date();
    if (!project.start_date)
      return { label: "Not Started", color: "bg-gray-200 text-gray-800" };
    if (new Date(project.start_date) > now)
      return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
    if (!project.end_date)
      return { label: "In Progress", color: "bg-green-100 text-green-800" };
    if (new Date(project.end_date) < now)
      return { label: "Completed", color: "bg-purple-100 text-purple-800" };
    return { label: "Active", color: "bg-green-100 text-green-800" };
  };

  const status = getStatus();

  // Count contributors
  const contributorCount = project.contributors?.length || 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex h-full flex-col rounded-xl shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
    >
      <Card className="border-border/60 flex h-full flex-col overflow-hidden rounded-xl border shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-blue-700 hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)] [&>*]:rounded-xl">
        <CardHeader className="bg-white px-4 pt-4 pb-2">
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-gray-900 group-hover:text-blue-800">
              {project.title}
            </h3>
            <Badge
              className={`${status.color} ml-2 font-medium whitespace-nowrap`}
            >
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col p-4 pt-0">
          {/* Project Description */}
          <p className="mt-2 mb-4 line-clamp-3 flex-grow text-sm text-gray-600 duration-200">
            {project.description || "No description available"}
          </p>

          {/* Project Metadata */}
          <div className="border-border/40 mt-auto flex flex-col gap-2 border-t pt-2">
            <div className="group-hover:text-primary/70 flex items-center text-xs text-gray-500">
              <CalendarIcon
                size={14}
                className="mr-2 text-gray-400 group-hover:text-blue-800"
              />
              <span>
                {startDate} {endDate !== "Ongoing" ? `- ${endDate}` : ""}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="group-hover:text-primary/70 flex items-center text-xs text-gray-500">
                <UsersIcon
                  size={14}
                  className="mr-2 text-gray-400 group-hover:text-blue-800"
                />
                <span>
                  {contributorCount} contributor
                  {contributorCount !== 1 ? "s" : ""}
                </span>
              </div>

              {role && role.trim() !== "" && (
                <div className="text-primary bg-primary/10 rounded-full px-2 py-1 text-xs font-medium">
                  {role}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
