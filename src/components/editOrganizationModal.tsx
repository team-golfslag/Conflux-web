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
import { useCallback, useContext, useEffect, useState } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import {
  OrganisationRequestDTO,
  OrganisationResponseDTO,
  OrganisationRoleType,
  ProjectOrganisationResponseDTO,
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
import { Plus, X, Building, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

interface OrganizationFormData {
  name: string;
  rorId?: string;
  role?: OrganisationRoleType;
}

interface ValidationError {
  field: string;
  message: string;
}

// Validation patterns for form fields
const validationPatterns = {
  rorId: {
    pattern: /^https:\/\/ror\.org\/[a-z0-9]{9}$/,
    description: "Valid ROR ID URL (e.g., https://ror.org/123456789)",
  },
  name: {
    minLength: 2,
    description: "Organization name must be at least 2 characters long",
  },
};

function validateField(field: string, value: string): ValidationError | null {
  if (!value || !value.trim()) {
    // Only validate if field has a value (optional fields)
    return null;
  }

  switch (field) {
    case "name":
      if (value.length < validationPatterns.name.minLength) {
        return { field, message: validationPatterns.name.description };
      }
      break;

    case "rorId":
      if (!validationPatterns.rorId.pattern.test(value)) {
        return {
          field,
          message: `Invalid ROR ID format. ${validationPatterns.rorId.description}`,
        };
      }
      break;
  }

  return null;
}

export interface EditOrganizationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organization?: OrganisationResponseDTO;
  projectId: string;
  onOrganizationUpdated?: () => void;
  onOrganizationAdded?: () => void;
  isEdit?: boolean;
  organizations?: ProjectOrganisationResponseDTO[];
}

export default function EditOrganizationModal({
  isOpen,
  onOpenChange,
  organization,
  projectId,
  onOrganizationUpdated,
  onOrganizationAdded,
  isEdit = false,
  organizations = [],
}: Readonly<EditOrganizationModalProps>) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: "",
    rorId: "",
    role: undefined,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [autoFillError, setAutoFillError] = useState<string | null>(null);

  const apiClient = useContext(ApiClientContext);

  // Validate fields when form data changes
  useEffect(() => {
    const errors: ValidationError[] = [];

    if (touched.name && formData.name) {
      const nameError = validateField("name", formData.name);
      if (nameError) errors.push(nameError);
    }

    if (touched.rorId && formData.rorId) {
      const rorIdError = validateField("rorId", formData.rorId);
      if (rorIdError) errors.push(rorIdError);
    }

    setValidationErrors(errors);
  }, [formData, touched]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
    setTouched((prev) => ({ ...prev, name: true }));
  };

  const handleRorIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, rorId: e.target.value }));
    setTouched((prev) => ({ ...prev, rorId: true }));
    // Clear error when input changes
    if (autoFillError) setAutoFillError(null);
  };

  const handleRorAutoFill = async (): Promise<boolean> => {
    if (!formData.rorId) return false;

    setAutoFillError(null);

    try {
      const id = formData.rorId.trim().split("/").pop();
      if (!id) {
        setAutoFillError("Invalid ROR ID format.");
        return false;
      }
      const result =
        await apiClient.projectOrganisations_GetOrganisationNameByRor(id);
      if (result && result.organisation) {
        setFormData((prev) => ({
          ...prev,
          name: result.organisation.name,
        }));
        return true;
      } else {
        setAutoFillError("No organization found with this ROR ID.");
        return false;
      }
    } catch (error) {
      console.error("Error searching ROR:", error);
      setAutoFillError("Failed to search ROR. Please try again.");
      return false;
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors.find((error) => error.field === field);
  };

  const resetForm = useCallback(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        rorId: organization.ror_id,
        role: organization.roles.find((r) => !r.end_date)?.role,
      });
    } else {
      setFormData({
        name: "",
        rorId: "",
        role: undefined,
      });
    }
    // Reset validation state
    setValidationErrors([]);
    setTouched({});
    setAutoFillError(null);
  }, [organization]);

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
  }, [isEdit, isOpen, resetForm]);

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

  // Find archived organization with matching ROR ID or name
  const findArchivedOrganization = () => {
    // First try to match by ROR ID if available
    if (formData.rorId) {
      const matchByRorId = organizations.find(
        (org) =>
          org.organisation.ror_id === formData.rorId &&
          org.organisation.roles.every((r) => r.end_date !== null),
      );
      if (matchByRorId) return matchByRorId;
    }

    // Then try to match by name if no ROR ID match found
    return organizations.find(
      (org) =>
        org.organisation.name === formData.name &&
        org.organisation.roles.every((r) => r.end_date !== null),
    );
  };

  const saveNewOrganization = async () => {
    try {
      // Check if there's an archived organization we can reuse
      const archivedOrg = findArchivedOrganization();

      if (archivedOrg) {
        // Reuse the archived organization
        const updatedOrganization = new OrganisationRequestDTO({
          name: formData.name,
          ror_id: formData.rorId || archivedOrg.organisation.ror_id,
          role: formData.role,
        });

        // Update the existing archived organization
        await apiClient.projectOrganisations_UpdateOrganisation(
          projectId,
          archivedOrg.organisation.id,
          updatedOrganization,
        );

        onOrganizationAdded?.();
      } else {
        // Create a new organization
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
      }
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

  const removeRole = () => {
    setFormData((prev) => ({
      name: prev.name,
      rorId: prev.rorId,
      role: null,
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-0 bg-white/95 shadow-2xl backdrop-blur-md">
        <DialogHeader className="space-y-3 border-b border-gray-100 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-lg bg-gray-100 p-2">
              <Building className="h-6 w-6 text-gray-600" />
            </div>
            {isEdit ? "Edit Organization" : "Add Organization"}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {isEdit
              ? "Update the organization information and role for this project."
              : "Add a new organization to this project with their specific role."}
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
          {({ isLoading, error, onSubmit }) => (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor={`${idPrefix}name`} className="text-right">
                    Name
                  </Label>
                  <div className="col-span-4 sm:col-span-3">
                    <Input
                      id={`${idPrefix}name`}
                      name="name"
                      className={`text-sm ${getFieldError("name") ? "border-red-500 focus:border-red-500" : ""}`}
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="Enter organization name"
                    />
                    {getFieldError("name") && (
                      <p className="mt-1 text-sm text-red-500">
                        {getFieldError("name")?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center">
                  <Label htmlFor={`${idPrefix}rorId`} className="text-right">
                    ROR ID
                  </Label>
                  <div className="col-span-4 sm:col-span-3">
                    <div className="flex items-center gap-2">
                      <Input
                        id={`${idPrefix}rorId`}
                        name="rorId"
                        className={`flex-1 text-sm ${getFieldError("rorId") || autoFillError ? "border-red-500 focus:border-red-500" : ""}`}
                        value={formData.rorId}
                        placeholder="https://ror.org/example123"
                        onChange={handleRorIdChange}
                        aria-invalid={
                          !!(getFieldError("rorId") || autoFillError)
                        }
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRorAutoFill}
                              disabled={!formData.rorId}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Autofill organization name from ROR</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {(getFieldError("rorId") || autoFillError) && (
                      <p className="mt-1 text-sm text-red-500">
                        {autoFillError || getFieldError("rorId")?.message}
                      </p>
                    )}
                    {formData.rorId &&
                      !getFieldError("rorId") &&
                      !autoFillError && (
                        <p className="mt-1 text-xs text-gray-500">
                          {validationPatterns.rorId.description}
                        </p>
                      )}
                  </div>
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
                  onClick={onSubmit}
                  disabled={
                    isLoading ||
                    !formData.name ||
                    (!formData.role && !isEdit) ||
                    validationErrors.length > 0
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
