/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  DescriptionType,
  ProjectResponseDTO,
  TitleType,
  UserRoleType,
} from "@team-golfslag/conflux-api-client/src/client";
import { Link } from "react-router-dom";
import { JSX } from "react";
import { CalendarIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatus } from "@/utils/projectUtils";

export interface ProjectCardProps {
  project: ProjectResponseDTO;
  roles?: string[];
}

/**
 * Represents a component that displays information about a project in a card layout. Used on dashboard and search page
 *
 * @param {ProjectCardProps} props - The properties required to render the project card.
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

  const status = getStatus(project.start_date, project.end_date);

  const primaryTitle = project.titles?.find(
    (title) => title.type === TitleType.Primary,
  );
  const primaryDescription = project.descriptions?.find(
    (desc) => desc.type === DescriptionType.Primary,
  );

  // Count contributors
  const contributorCount = project.contributors?.length ?? 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex h-full flex-col rounded-2xl transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02]"
    >
      <Card className="border-border/60 flex h-full flex-col overflow-hidden rounded-xl border shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-blue-700 hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)] [&>*]:rounded-xl">
        <CardHeader className="relative bg-white px-4 pt-4 pb-2">
          <div className="h-14 pr-28">
            <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-gray-900 group-hover:text-blue-800">
              {primaryTitle?.text ?? "No title available"}
            </h3>
          </div>
          <Badge
            className={`${status.color} absolute top-4 right-4 font-medium whitespace-nowrap shadow-sm`}
            data-cy="project-status"
          >
            {status.label}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-grow flex-col pt-6">
          {/* Project Description */}
          <p className="mb-3 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
            {primaryDescription?.text ?? "No description available"}
          </p>

          {/* Project Metadata */}
          <div className="border-border/30 mt-auto space-y-3 border-t pt-4">
            <div className="flex flex-col gap-3 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 group-hover:bg-blue-100">
                  <CalendarIcon
                    size={14}
                    className="text-gray-500 transition-colors duration-200 group-hover:text-gray-700"
                  />
                </div>
                <span className="font-medium">
                  {startDate}{" "}
                  {endDate !== "Ongoing" ? `- ${endDate}` : ": Ongoing"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 group-hover:bg-green-100">
                    <UsersIcon
                      size={14}
                      className="text-gray-500 transition-colors duration-200 group-hover:text-green-600"
                    />
                  </div>
                  <span className="font-medium">
                    {contributorCount} contributor
                    {contributorCount !== 1 ? "s" : ""}
                  </span>
                </div>
                {roles && roles.length > 0 && (
                  <div className="flex flex-wrap justify-end gap-1">
                    {roles
                      .filter((r) => r !== UserRoleType.User)
                      .map((r) => (
                        <Badge
                          key={r}
                          variant="secondary"
                          className="h-6 border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-all duration-200 hover:border-gray-300"
                        >
                          {r}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
