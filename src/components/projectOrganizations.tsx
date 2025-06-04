/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { JSX, useState } from "react";
import {
  ProjectOrganisationResponseDTO,
  OrganisationRoleType,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import Organization from "@/components/organization.tsx";
import { Label } from "@/components/ui/label.tsx";
import EditOrganizationModal from "@/components/editOrganizationModal.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Edit, X } from "lucide-react";
import { Button } from "./ui/button";

export interface ProjectOrganizationsProps {
  isAdmin?: boolean;
  projectId: string;
  organizations: ProjectOrganisationResponseDTO[];
  onProjectUpdate?: () => void;
}

export default function ProjectOrganizations({
  isAdmin = false,
  projectId,
  organizations,
  onProjectUpdate,
}: Readonly<ProjectOrganizationsProps>): JSX.Element {
  const [editMode, setEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<
    ProjectOrganisationResponseDTO | undefined
  >();

  const toggleEditMode = () => setEditMode(!editMode);

  const formatRoleType = (roleType: string): string => {
    return roleType.replace(/([A-Z])/g, " $1").trim();
  };

  const handleEditOrganization = (org: ProjectOrganisationResponseDTO) => {
    setEditingOrganization(org);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="relative flex justify-between">
          <CardTitle className="text-xl font-semibold">Organizations</CardTitle>
          <div
            className={
              "absolute right-0 items-center justify-between space-x-4 px-4 group-hover:flex"
            }
          >
            {isAdmin && (
              <div className="invisible flex items-center gap-2 group-hover/card:visible">
                <Button variant="outline" size="sm" onClick={toggleEditMode}>
                  {editMode ? (
                    <>
                      <X className="mr-2 h-4 w-4" /> Exit Edit Mode
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </>
                  )}
                </Button>

                <EditOrganizationModal
                  isOpen={isAddModalOpen}
                  onOpenChange={setIsAddModalOpen}
                  projectId={projectId}
                  onOrganizationAdded={onProjectUpdate}
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {editMode && (
            <div className="bg-destructive/10 text-destructive rounded-md p-2 text-center text-sm">
              Edit mode active. You can edit organizations from the project.
            </div>
          )}
          <div>
            <ul className="space-y-6">
              {Object.values(OrganisationRoleType).map((roleType) => {
                const orgsWithRole = organizations.filter((org) =>
                  org.organisation.roles.some(
                    (r) => r.role === roleType && !r.end_date,
                  ),
                );
                if (orgsWithRole.length === 0) return null;
                return (
                  <li key={roleType}>
                    <Label className="border-b pb-1 text-base">
                      {formatRoleType(roleType)}
                    </Label>
                    <ul className="space-y-2">
                      {orgsWithRole.map((org) => (
                        <li key={org.organisation.id}>
                          <Organization
                            org={org}
                            editMode={editMode}
                            onEditClick={() => handleEditOrganization(org)}
                            roleType={roleType}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardContent>
      </Card>
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        organization={editingOrganization?.organisation}
        projectId={projectId}
        onOrganizationUpdated={onProjectUpdate}
        isEdit={true}
      />
    </>
  );
}
