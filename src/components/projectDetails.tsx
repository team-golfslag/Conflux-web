/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { useContext, useState } from "react";
import {
  ProjectResponseDTO,
  ApiClient,
  ProjectRequestDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { Edit, Check, X, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ApiMutation } from "./apiMutation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { DatePicker } from "./ui/datepicker";
import { ApiClientContext } from "@/lib/ApiClientContext";

type ProjectDetailsProps = {
  project: ProjectResponseDTO;
  isAdmin: boolean;
  onProjectUpdate: () => void;
};

const determineStatus = (
  startDate: Date | undefined | null,
  endDate: Date | undefined | null,
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
  isAdmin,
  onProjectUpdate,
}: Readonly<ProjectDetailsProps>) {
  const apiClient = useContext(ApiClientContext);
  const [editMode, setEditMode] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | null | undefined
  >(project.start_date);
  const [selectedEndDate, setSelectedEndDate] = useState<
    Date | null | undefined
  >(project.end_date);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | undefined
  >(project.organisations[0]?.ror_id);

  const toggleEditMode = () => {
    if (editMode) {
      // Reset selections to current values if canceling
      setSelectedStartDate(project.start_date);
      setSelectedEndDate(project.end_date);
      setSelectedOrganizationId(project.organisations[0]?.ror_id);
    }
    setEditMode(!editMode);
  };

  // States to track sync progress
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);

  // Method to sync project data with SRAM
  const syncWithSram = async () => {
    try {
      setIsSyncing(true);
      setSyncSuccess(false);
      setSyncFailed(false);
      await apiClient.projects_SyncProject(project.id);
      onProjectUpdate();
      setSyncSuccess(true);
      // Reset success state after 2 seconds
      setTimeout(() => {
        setSyncSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error syncing with SRAM:", error);
      setSyncFailed(true);
      // Reset failure state after 2 seconds
      setTimeout(() => {
        setSyncFailed(false);
      }, 2000);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProject = async (apiClient: ApiClient) => {
    // Update project dates only
    return apiClient.projects_PutProject(
      project.id,
      new ProjectRequestDTO({
        start_date: selectedStartDate ?? project.start_date ?? new Date(),
        end_date: selectedEndDate === null ? undefined : selectedEndDate,
      }),
    );
  };

  // Helper function to get all project leads
  const getProjectLeads = (
    contributors: Array<{ leader: boolean; person: { name: string } }>,
  ) => {
    const leads = contributors.filter((contributor) => contributor.leader);
    return leads.length > 0
      ? leads.map((lead) => lead.person.name).join(", ")
      : "N/A";
  };

  // Helper function to get all project contacts
  const getProjectContacts = (
    contributors: Array<{ contact: boolean; person: { name: string } }>,
  ) => {
    const contacts = contributors.filter((contributor) => contributor.contact);
    return contacts.length > 0
      ? contacts.map((contact) => contact.person.name).join(", ")
      : "N/A";
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Details</CardTitle>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative group-hover:inline-flex"
                  onClick={syncWithSram}
                  disabled={isSyncing}
                >
                  {syncSuccess ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : syncFailed ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <RefreshCw
                      className={`h-4 w-4 transition-transform duration-300 ${isSyncing ? "animate-spin" : "hover:rotate-90"}`}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isSyncing
                    ? "Syncing..."
                    : syncSuccess
                      ? "Sync complete!"
                      : syncFailed
                        ? "Sync failed!"
                        : "Sync this project with SRAM"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isAdmin && (
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
          )}
        </div>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <ApiMutation
            mutationFn={updateProject}
            data={{}}
            loadingMessage="Updating project details..."
            mode="component"
            onSuccess={() => {
              setEditMode(false);
              onProjectUpdate();
            }}
          >
            {({ onSubmit, isLoading: outerLoading }) => (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="font-semibold">
                    Status
                  </Label>
                  <p className="text-gray-700">
                    {determineStatus(project.start_date, project.end_date)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="project-lead" className="font-semibold">
                    Project Lead
                  </Label>
                  <p className="text-gray-700">
                    {getProjectLeads(project.contributors)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="project-contacts" className="font-semibold">
                    Project Contacts
                  </Label>
                  <p className="text-gray-700">
                    {getProjectContacts(project.contributors)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="start-date" className="font-semibold">
                    Start Date
                  </Label>
                  <DatePicker
                    className="mt-1 flex flex-nowrap gap-2 overflow-visible pr-1"
                    buttonClassName="w-full max-w-[calc(100%-44px)]"
                    initialDate={project.start_date}
                    onDateChange={setSelectedStartDate}
                  />
                </div>

                <div>
                  <Label htmlFor="end-date" className="font-semibold">
                    End Date
                  </Label>
                  <DatePicker
                    className="mt-1 flex flex-nowrap gap-2 overflow-visible pr-1"
                    buttonClassName="w-full max-w-[calc(100%-44px)]"
                    initialDate={project.end_date}
                    onDateChange={setSelectedEndDate}
                  />
                </div>

                <div>
                  <Label htmlFor="lead-organization" className="font-semibold">
                    Lead Organisation
                  </Label>
                  <Select
                    value={selectedOrganizationId}
                    onValueChange={setSelectedOrganizationId}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select lead organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {project.organisations.map((org) => (
                        <SelectItem key={org.ror_id} value={org.ror_id || ""}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="default"
                    className="flex items-center gap-1"
                    onClick={onSubmit}
                    disabled={outerLoading}
                  >
                    <Check size={16} /> Save Changes
                  </Button>
                </div>
              </div>
            )}
          </ApiMutation>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status" className="font-semibold">
                Status
              </Label>
              <p className="text-gray-700">
                {determineStatus(project.start_date, project.end_date)}
              </p>
            </div>

            <div>
              <Label htmlFor="project-lead" className="font-semibold">
                Project Lead
              </Label>
              <p className="text-gray-700">
                {getProjectLeads(project.contributors)}
              </p>
            </div>

            <div>
              <Label htmlFor="project-contacts" className="font-semibold">
                Project Contacts
              </Label>
              <p className="text-gray-700">
                {getProjectContacts(project.contributors)}
              </p>
            </div>

            <div>
              <Label htmlFor="start-date" className="font-semibold">
                Start Date
              </Label>
              <p className="text-gray-700">
                {project.start_date
                  ? format(project.start_date, "d MMMM yyyy")
                  : "N/A"}
              </p>
            </div>

            <div>
              <Label htmlFor="end-date" className="font-semibold">
                End Date
              </Label>
              <p className="text-gray-700">
                {project.end_date
                  ? format(project.end_date, "d MMMM yyyy")
                  : "N/A"}
              </p>
            </div>

            <div>
              <Label htmlFor="lead-organization" className="font-semibold">
                Lead Organisation
              </Label>
              <p className="text-gray-700">
                {project.organisations.length > 0
                  ? project.organisations[0].name
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
