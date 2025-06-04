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
import { Edit, X, Archive, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
  const [showArchived, setShowArchived] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<
    ProjectOrganisationResponseDTO | undefined
  >();

  const toggleEditMode = () => setEditMode(!editMode);

  const getActiveOrganizations = (
    organizations: ProjectOrganisationResponseDTO[],
  ) => {
    return organizations.filter((org) =>
      org.organisation.roles.some((r) => !r.end_date),
    );
  };

  const getArchivedOrganizations = (
    organizations: ProjectOrganisationResponseDTO[],
  ) => {
    return organizations.filter((org) =>
      org.organisation.roles.every((r) => r.end_date),
    );
  };

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
        <CardHeader className="relative flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Organizations
            </CardTitle>
            <div className="mt-3 flex items-center gap-2">
              <Badge
                variant={showArchived ? "outline" : "default"}
                className="cursor-pointer"
                onClick={() => setShowArchived(false)}
              >
                <Building2 className="mr-1 h-3 w-3" />
                Active ({getActiveOrganizations(organizations).length})
              </Badge>
              <Badge
                variant={showArchived ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setShowArchived(true)}
              >
                <Archive className="mr-1 h-3 w-3" />
                Archived ({getArchivedOrganizations(organizations).length})
              </Badge>
            </div>
          </div>

          {isAdmin && (
            <div className="invisible absolute right-0 flex items-center gap-2 px-4 group-hover/card:visible">
              <Button variant="outline" size="sm" onClick={toggleEditMode}>
                {editMode ? (
                  <>
                    <X className="h-4 w-4" /> Exit Edit Mode
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" /> Edit
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
        </CardHeader>

        <CardContent>
          {editMode && (
            <div className="bg-destructive/10 text-destructive rounded-md p-2 text-center text-sm">
              Edit mode active. You can edit organizations from the project{" "}
              {showArchived ? "(including archived ones)" : ""}.
            </div>
          )}
          <div>
            {showArchived &&
            getArchivedOrganizations(organizations).length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Archive className="mx-auto mb-2 h-12 w-12 opacity-50" />
                <p>No archived organizations found</p>
              </div>
            ) : showArchived ? (
              // Archived organizations - display without role grouping
              <ul className="space-y-2">
                {getArchivedOrganizations(organizations).map((org) => (
                  <li key={org.organisation.id}>
                    <Organization
                      org={org}
                      editMode={editMode}
                      onEditClick={() => handleEditOrganization(org)}
                      roleType={OrganisationRoleType.OtherOrganization} // Default role for display purposes
                      isArchived={true}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              // Active organizations - display with role grouping
              <ul className="space-y-6">
                {Object.values(OrganisationRoleType).map((roleType) => {
                  const activeOrgs = getActiveOrganizations(organizations);
                  const orgsWithRole = activeOrgs.filter((org) =>
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
                              isArchived={false}
                            />
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
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
