/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { JSX, useState } from "react";
import {
  OrganisationDTO,
  OrganisationRoleType,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import Organization from "@/components/organization.tsx";
import { Label } from "@/components/ui/label.tsx";
import EditOrganizationModal from "@/components/editOrganizationModal.tsx";

export interface ProjectOrganizationsProps {
  editMode: boolean;
  projectId: string;
  organizations: OrganisationDTO[];
  onProjectUpdate?: () => void;
}

export default function ProjectOrganizations({
  editMode,
  projectId,
  organizations,
  onProjectUpdate,
}: Readonly<ProjectOrganizationsProps>): JSX.Element {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<
    OrganisationDTO | undefined
  >();

  const formatRoleType = (roleType: string): string => {
    return roleType.replace(/([A-Z])/g, " $1").trim();
  };

  const handleEditOrganization = (org: OrganisationDTO) => {
    setEditingOrganization(org);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="flex justify-between">
          <Label className="mb-4 font-semibold">Organizations</Label>
          {editMode && (
            <EditOrganizationModal
              isOpen={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
              projectId={projectId}
              onOrganizationAdded={onProjectUpdate}
            />
          )}
        </div>
        <ul className="ml-2 space-y-6">
          {Object.values(OrganisationRoleType).map((roleType) => {
            const orgsWithRole = organizations.filter((org) =>
              org.roles.some((r) => r.role === roleType),
            );
            if (orgsWithRole.length === 0) return null;
            return (
              <li key={roleType}>
                <Label className="border-b pb-1">
                  {formatRoleType(roleType)}
                </Label>
                <ul className="space-y-2">
                  {orgsWithRole.map((org) => (
                    <li key={org.id}>
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
      <EditOrganizationModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        organization={editingOrganization}
        projectId={projectId}
        onOrganizationUpdated={onProjectUpdate}
        isEdit={true}
      />
    </>
  );
}
