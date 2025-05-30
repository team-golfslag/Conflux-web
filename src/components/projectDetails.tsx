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
import { Edit, Check, X, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ApiMutation } from "./apiMutation";
import { Label } from "./ui/label";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { getStatus } from "@/utils/projectUtils";
import { Badge } from "@/components/ui/badge.tsx";
import ProjectDates from "@/components/projectDates.tsx";
import ProjectOrganizations from "@/components/projectOrganizations.tsx";

type ProjectDetailsProps = {
  project: ProjectResponseDTO;
  isAdmin: boolean;
  onProjectUpdate: () => void;
};

export default function ProjectDetails({
  project,
  isAdmin,
  onProjectUpdate,
}: Readonly<ProjectDetailsProps>) {
  const apiClient = useContext(ApiClientContext);
  const [editMode, setEditMode] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    project.start_date,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    project.end_date,
  );

  const toggleEditMode = () => {
    if (editMode) {
      // Reset selections to current values if canceling
      setSelectedStartDate(project.start_date);
      setSelectedEndDate(project.end_date);
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

  const status = getStatus(project.start_date, project.end_date);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
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
                  ) : (
                    <>
                      {syncFailed ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <RefreshCw
                          className={`h-4 w-4 transition-transform duration-300 ${isSyncing ? "animate-spin" : "hover:rotate-90"}`}
                        />
                      )}
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isSyncing ? (
                    "Syncing..."
                  ) : (
                    <>
                      {syncSuccess ? (
                        "Sync complete!"
                      ) : (
                        <>
                          {syncFailed
                            ? "Sync failed!"
                            : "Sync this project with SRAM"}
                        </>
                      )}
                    </>
                  )}
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
        <div className="flex flex-col gap-4">
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
                <>
                  <div>
                    <Label htmlFor="status" className="font-semibold">
                      Status
                    </Label>
                    <Badge
                      className={`${status.color} mt-1 font-medium whitespace-nowrap`}
                    >
                      {status.label}
                    </Badge>
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

                  <ProjectDates
                    editMode={editMode}
                    start_date={project.start_date}
                    end_date={project.end_date}
                    setSelectedStartDate={setSelectedStartDate}
                    setSelectedEndDate={setSelectedEndDate}
                  />

                  <ProjectOrganizations
                    projectId={project.id}
                    editMode={editMode}
                    organizations={project.organisations}
                    onProjectUpdate={onProjectUpdate}
                  />

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
                </>
              )}
            </ApiMutation>
          ) : (
            <>
              <div>
                <Label htmlFor="status" className="font-semibold">
                  Status
                </Label>
                <Badge
                  className={`${status.color} mt-1 font-medium whitespace-nowrap`}
                >
                  {status.label}
                </Badge>
              </div>

              <div>
                <Label htmlFor="project-lead" className="font-semibold">
                  Project Lead
                </Label>
                <p className="pt-1 pb-2 text-gray-700">
                  {getProjectLeads(project.contributors)}
                </p>
              </div>

              <div>
                <Label htmlFor="project-contacts" className="font-semibold">
                  Project Contacts
                </Label>
                <p className="pt-1 pb-2 text-gray-700">
                  {getProjectContacts(project.contributors)}
                </p>
              </div>

              <ProjectDates
                editMode={editMode}
                start_date={project.start_date}
                end_date={project.end_date}
              />
              <ProjectOrganizations
                projectId={project.id}
                editMode={editMode}
                organizations={project.organisations}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
