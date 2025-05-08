/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { ProjectDTO } from "@team-golfslag/conflux-api-client/src/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";

type ProjectDetailsProps = { project: ProjectDTO };

const determineStatus = (
  startDate: Date | undefined,
  endDate: Date | undefined,
) => {
  const now = new Date();
  if (!startDate || startDate > now) {
    return "Not started";
  } else if (endDate && endDate < now) {
    return "Ended";
  } else {
    return "Active";
  }
};

export default function ProjectDetails({
  project,
}: Readonly<ProjectDetailsProps>) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="font-semibold">Status</h3>
          <p className="text-gray-700">
            {determineStatus(project.start_date, project.end_date)}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Project Lead</h3>
          {/* TODO: make this the actual project lead*/}
          <p className="text-gray-700">Dr. J. Doe</p>
        </div>
        <div>
          <h3 className="font-semibold">Dates</h3>
          <div className="flex text-gray-700">
            <div className="w-12 font-medium">Start:</div>
            {format(project.start_date ?? "N/A", "d MMMM yyyy")}
          </div>
          <p className="flex text-gray-700">
            <span className="w-12 font-medium">End:</span>
            {format(project.end_date ?? "N/A", "d MMMM yyyy")}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Lead Organisation</h3>
          <p className="text-gray-700">
            {/*TODO: make this the actual lead organisation*/}
            {project.organisations.length > 0
              ? project.organisations[0].name
              : "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
