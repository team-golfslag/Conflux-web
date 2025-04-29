/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Link } from "react-router";
import { Project } from "@team-golfslag/conflux-api-client/src/client";

type ProjectCardProps = {
  project: Project;
};

const determineStatus = (
  startDate: Date | undefined,
  endDate: Date | undefined,
) => {
  const now = new Date();
  if (!startDate || startDate > now) {
    return "not started";
  } else if (endDate && endDate < now) {
    return "ended";
  } else {
    return "active";
  }
};

/**
 * Project Card component
 * @param props the project to be turned into the card
 */
const ProjectCard = (props: ProjectCardProps) => {
  const startDate: string = props.project.start_date
    ? new Date(props.project.start_date).toLocaleDateString("nl-NL")
    : "no date";
  const endDate: string = props.project.end_date
    ? new Date(props.project.end_date).toLocaleDateString("nl-NL")
    : "no date";
  const status: string = determineStatus(
    props.project.start_date,
    props.project.end_date,
  );

  let statusColor: string;
  if (status === "active") statusColor = "text-green-600";
  else if (status === "not started") statusColor = "text-zinc-600";
  else statusColor = "text-yellow-800";

  return (
    <Link
      to={`/projects/${props.project.id}`}
      className="group border-border flex h-[25rem] w-full max-w-md rounded-lg border-1 px-4 py-4 duration-200 hover:cursor-pointer hover:border-blue-700 hover:shadow-lg hover:shadow-gray-300 md:max-w-84"
    >
      <div className="flex w-full flex-col overflow-y-clip">
        <h2 className="mb-3 line-clamp-4 text-2xl duration-200 group-hover:text-blue-800">
          {props.project.title}
        </h2>
        <p className="line-clamp-5 text-left text-base">
          {props.project.description}
        </p>
        <div className="mt-4 flex items-center border-t-1 pt-4">
          <span className="w-22 text-xs font-semibold text-gray-600 uppercase duration-200 group-hover:text-blue-800">
            start date:
          </span>
          <span>{startDate}</span>
        </div>
        <div className="flex items-center">
          <span className="w-22 text-xs font-semibold text-gray-600 uppercase duration-200 group-hover:text-blue-800">
            end date:
          </span>
          <span>{endDate}</span>
        </div>
        <div className="flex items-center pt-1">
          <span className="w-22 text-xs font-semibold text-gray-600 uppercase duration-200 group-hover:text-blue-800">
            status:
          </span>
          <span className={`${statusColor} font-semibold`}>{status}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
