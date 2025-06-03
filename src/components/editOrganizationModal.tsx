/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useContext, useEffect, useState } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import {
  OrganisationRequestDTO,
  OrganisationResponseDTO,
  OrganisationRoleType,
} from "@team-golfslag/conflux-api-client/src/client";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { ApiMutation } from "@/components/apiMutation.tsx";
import { Plus, X } from "lucide-react";

interface OrganizationFormData {
  name: string;
  rorId?: string;
  role?: OrganisationRoleType;
}

export interface EditOrganizationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organization?: OrganisationResponseDTO;
  projectId: string;
  onOrganizationUpdated?: () => void;
  onOrganizationAdded?: () => void;
  isEdit?: boolean;
}

export default function EditOrganizationModal({
  isOpen,
  onOpenChange,
  organization,
  projectId,
  onOrganizationUpdated,
  onOrganizationAdded,
  isEdit = false,
}: Readonly<EditOrganizationModalProps>) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    rorId: "",
    role: undefined,
  });

  const apiClient = useContext(ApiClientContext);

  const resetForm = () => {
    if (organization) {
      setFormData({
        name: organization.name,
        rorId: organization.ror_id,
        role: organization.roles.find((r) => !r.end_date)!.role,
      });
    } else {
      setFormData({
        name: "",
        rorId: "",
        role: undefined,
      });
    }
  };

  //update form if organization changes
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        rorId: organization.ror_id,
        role: organization.roles.find((r) => !r.end_date)?.role,
      });
    }
  }, [organization]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isOpen && !isEdit) {
      resetForm();
    }
  }, [isEdit, isOpen]);

  const saveEditedOrganization = async () => {
    if (!organization) return;
    try {
      const updatedOrganization = new OrganisationRequestDTO({
        name: formData.name,
        ror_id: formData.rorId,
        role: formData.role,
      });
      await apiClient.projectOrganisations_UpdateOrganisation(
        projectId,
        organization.id,
        updatedOrganization,
      );
      onOrganizationUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating organization:", error);
      alert(
        `Failed to update organization: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  };

  const saveNewOrganization = async () => {
    try {
      const newOrganization = new OrganisationRequestDTO({
        name: formData.name,
        ror_id: formData.rorId,
        role: formData.role,
      });
      await apiClient.projectOrganisations_CreateOrganisation(
        projectId,
        newOrganization,
      );
      onOrganizationAdded?.();
    } catch (error) {
      console.error("Error adding organization:", error);
      alert(
        `Failed to add organization: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  };

  const updateRole = (value: string | Date | undefined) => {
    setFormData((prev) => {
      return { ...prev, role: value };
    });
  };

  const formatRoleType = (roleType: string): string => {
    return roleType.replace(/([A-Z])/g, " $1").trim();
  };

  // Check if the ROR ID is a valid URL, if there is one
  const checkRorUrl = (rorId?: string) => {
    return !rorId || rorId.startsWith("https://ror.org/");
  };

  const removeRole = () => {
    setFormData((prev) => ({
      name: prev.name,
      rorId: prev.rorId,
      role: undefined,
    }));
  };

  const idPrefix = "edit-";
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-9/10 overflow-scroll">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Organization" : "Add Organization"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the organization information for this project."
              : "Add a new organization to this project."}
          </DialogDescription>
        </DialogHeader>

        <ApiMutation
          mutationFn={isEdit ? saveEditedOrganization : saveNewOrganization}
          data={{}}
          loadingMessage={
            isEdit ? "Updating organization..." : "Adding organization..."
          }
          mode="component"
          onSuccess={() => {
            onOrganizationUpdated?.();
            onOrganizationAdded?.();
            onOpenChange(false);
            resetForm();
          }}
        >
          {({ isLoading, error }) => (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor={`${idPrefix}name`} className="text-right">
                    Name
                  </Label>
                  <Input
                    id={`${idPrefix}name`}
                    name="name"
                    className="col-span-4 text-sm sm:col-span-3"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor={`${idPrefix}rorId`} className="text-right">
                    ROR ID
                  </Label>
                  <Input
                    id={`${idPrefix}rorId`}
                    name="rorId"
                    className="col-span-4 text-sm sm:col-span-3"
                    value={formData.rorId}
                    placeholder="https://ror.org/example"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rorId: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center">
                  <Label
                    htmlFor={`${idPrefix}roles`}
                    className="self-start text-right sm:pt-4"
                  >
                    Role
                  </Label>
                  <div className="col-span-4 flex flex-col gap-4 sm:col-span-3">
                    <div className="grid grid-cols-4 gap-3 border-t pt-2">
                      <div className="col-span-4 flex flex-col sm:flex-row sm:items-center">
                        <Select
                          value={formData.role}
                          onValueChange={(value) => updateRole(value)}
                        >
                          <SelectTrigger className="max-w-sm">
                            <SelectValue placeholder="Select role type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(OrganisationRoleType).map(
                              (roleType) => (
                                <SelectItem key={roleType} value={roleType}>
                                  {formatRoleType(roleType)}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          className="text-muted-foreground mx-2 cursor-pointer"
                          size="sm"
                          onClick={() => {
                            removeRole();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                {error && (
                  <div className="text-destructive text-xs">
                    {error.message}
                  </div>
                )}
                <Button
                  onClick={
                    isEdit ? saveEditedOrganization : saveNewOrganization
                  }
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.role ||
                    !checkRorUrl(formData.rorId)
                  }
                >
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <span>{isEdit ? "Save Changes" : "Add Organization"}</span>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </ApiMutation>
      </DialogContent>
    </Dialog>
  );
}
