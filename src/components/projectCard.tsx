/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { ProjectDTO } from "@team-golfslag/conflux-api-client/src/client";
import { Link } from "react-router-dom";
import { JSX } from "react";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProjectCardProps {
  project: ProjectDTO;
  roles?: string[];
}

/**
 * Represents a component that displays information about a project in a card layout. Used on dashboard and search page
 *
 * @param {ProjectCardProps} props - The properties required to render the project card.
 * @param {ProjectDTO} props.project - The project data to display.
 * @param {string[]} props.roles - The user's roles in the project, if available.
 *
 * @returns {JSX.Element} A styled card element showing project details, including title, description, dates, contributors count, and user roles.
 */
const ProjectCard = ({ project, roles }: ProjectCardProps): JSX.Element => {
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
  const contributorCount = project.contributors?.length ?? 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex h-full flex-col rounded-xl shadow-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
    >
      <Card className="border-border/60 flex h-full flex-col overflow-hidden rounded-xl border shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-blue-700 hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)] [&>*]:rounded-xl">
        <CardHeader className="bg-white px-4 pt-4 pb-2">
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-gray-900 group-hover:text-blue-800">
              {project.primary_title?.text ?? "No title available"}
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
            {project.primary_description?.text ?? "No description available"}
          </p>

          {/* Project Metadata */}
          <div className="border-border/40 mt-auto border-t pt-2">
            <div className="group-hover:text-primary/70 flex justify-between text-xs text-gray-500">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <CalendarIcon
                    size={14}
                    className="mr-2 text-gray-400 group-hover:text-blue-800"
                  />
                  <span>
                    {startDate}{" "}
                    {endDate !== "Ongoing" ? `- ${endDate}` : ": Ongoing"}
                  </span>
                </div>
                <div className="flex items-center">
                  <UsersIcon
                    size={14}
                    className="mr-2 text-gray-400 group-hover:text-blue-800"
                  />
                  <span>
                    {contributorCount} contributor
                    {contributorCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              {roles && roles.length > 0 && (
                <div className="flex flex-col items-end gap-1">
                  {roles.map((r) => (
                    <Badge
                      key={r}
                      variant="secondary"
                      className="h-5 px-2 py-0 text-xs"
                    >
                      {r}
                    </Badge>
                  ))}
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
