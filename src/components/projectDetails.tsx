/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useState } from "react";
import {
  ProjectDTO,
  ApiClient,
  ContributorDTO,
  ProjectPatchDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Edit, Check, X } from "lucide-react";
import { ApiMutation } from "./apiMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";

type ProjectDetailsProps = {
  project: ProjectDTO;
  onProjectUpdate: () => void;
};

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
  onProjectUpdate,
}: Readonly<ProjectDetailsProps>) {
  const [editMode, setEditMode] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    project.start_date,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    project.end_date,
  );
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | undefined>(
    project.contributors.find((c) => c.leader)?.person.id,
  );
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | undefined
  >(project.organisations[0]?.id);

  const toggleEditMode = () => {
    if (editMode) {
      // Reset selections to current values if canceling
      setSelectedStartDate(project.start_date);
      setSelectedEndDate(project.end_date);
      setSelectedLeaderId(
        project.contributors.find((c) => c.leader)?.person.id,
      );
      setSelectedOrganizationId(project.organisations[0]?.id);
    }
    setEditMode(!editMode);
  };

  const updateProject = async (apiClient: ApiClient) => {
    // Update contributor roles if leader changed
    if (selectedLeaderId) {
      // First, unset any existing leader
      for (const contributor of project.contributors) {
        if (contributor.leader && contributor.person.id !== selectedLeaderId) {
          await apiClient.contributors_UpdateContributor(
            project.id,
            contributor.person.id,
            new ContributorDTO({
              ...contributor,
              leader: false,
            }),
          );
        }
      }

      // Set the new leader
      const newLeader = project.contributors.find(
        (c) => c.person.id === selectedLeaderId,
      );
      if (newLeader && !newLeader.leader) {
        await apiClient.contributors_UpdateContributor(
          project.id,
          newLeader.person.id,
          new ContributorDTO({
            ...newLeader,
            leader: true,
          }),
        );
      }
    }
    // Update project dates
    return apiClient.projects_PatchProject(
      project.id,
      new ProjectPatchDTO({
        start_date: selectedStartDate,
        end_date: selectedEndDate,
        // We'd include organization updates here if the API supports it
      }),
    );
  };

  const projectLead = project.contributors.find(
    (contributor) => contributor.leader,
  );

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Details</CardTitle>
        <Button variant="outline" size="sm" onClick={toggleEditMode}>
          {editMode ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {selectedStartDate
                      ? format(selectedStartDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedStartDate}
                    onSelect={setSelectedStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {selectedEndDate
                      ? format(selectedEndDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedEndDate}
                    onSelect={setSelectedEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="project-lead">Project Lead</Label>
              <Select
                value={selectedLeaderId}
                onValueChange={setSelectedLeaderId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project lead" />
                </SelectTrigger>
                <SelectContent>
                  {project.contributors.map((contributor) => (
                    <SelectItem
                      key={contributor.person.id}
                      value={contributor.person.id}
                    >
                      {contributor.person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lead-organization">Lead Organization</Label>
              <Select
                value={selectedOrganizationId}
                onValueChange={setSelectedOrganizationId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead organization" />
                </SelectTrigger>
                <SelectContent>
                  {project.organisations.map((org) => (
                    <SelectItem key={org.id} value={org.id || ""}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <ApiMutation
                mutationFn={updateProject}
                data={{}}
                loadingMessage="Updating project details..."
                onSuccess={() => {
                  setEditMode(false);
                  onProjectUpdate();
                }}
              >
                {({ onSubmit, isLoading }) => (
                  <Button
                    variant="default"
                    className="flex items-center gap-1"
                    onClick={onSubmit}
                    disabled={isLoading}
                  >
                    <Check size={16} /> Save Changes
                  </Button>
                )}
              </ApiMutation>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h3 className="font-semibold">Status</h3>
              <p className="text-gray-700">
                {determineStatus(project.start_date, project.end_date)}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Project Lead</h3>
              <p className="text-gray-700">
                {projectLead ? projectLead.person.name : "N/A"}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Dates</h3>
              <div className="flex text-gray-700">
                <div className="w-12 font-medium">Start:</div>
                {project.start_date
                  ? format(project.start_date, "d MMMM yyyy")
                  : "N/A"}
              </div>
              <p className="flex text-gray-700">
                <span className="w-12 font-medium">End:</span>
                {project.end_date
                  ? format(project.end_date, "d MMMM yyyy")
                  : "N/A"}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Lead Organisation</h3>
              <p className="text-gray-700">
                {project.organisations.length > 0
                  ? project.organisations[0].name
                  : "N/A"}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
