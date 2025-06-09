/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Pencil } from "lucide-react";
import ContributorFormFields from "./contributorFormFields";
import {
  ContributorRoleType,
  ContributorPositionType,
  ContributorRequestDTO,
  ContributorResponseDTO,
  PersonRequestDTO,
  ApiClient,
} from "@team-golfslag/conflux-api-client/src/client";
import {
  formatOrcidAsUrl,
  extractOrcidFromUrl,
} from "@/lib/formatters/orcidFormatter";
import { ApiMutation } from "@/components/apiMutation";
import { ApiClientContext } from "@/lib/ApiClientContext";

interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  position?: ContributorPositionType;
  leader: boolean;
  contact: boolean;
}

interface EditContributorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contributor: ContributorResponseDTO | null;
  projectId: string;
  onContributorUpdated: (contributor: ContributorResponseDTO) => void;
  isConfluxUser?: boolean;
}

export default function EditContributorModal({
  isOpen,
  onOpenChange,
  contributor,
  projectId,
  onContributorUpdated,
  isConfluxUser = false,
}: Readonly<EditContributorModalProps>) {
  const [formData, setFormData] = useState<ContributorFormData>({
    name: "",
    email: "",
    orcidId: "",
    roles: [],
    position: undefined,
    leader: false,
    contact: false,
  });

  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const apiClient = useContext(ApiClientContext);

  // Update form when contributor changes
  useEffect(() => {
    if (contributor) {
      setFormData({
        name: contributor.person.name,
        email: contributor.person.email || "",
        orcidId: extractOrcidFromUrl(contributor.person.orcid_id) || "",
        roles: contributor.roles.map((role) => role.role_type),
        position: contributor.positions.find((p) => !p.end_date)?.position,
        leader: contributor.leader,
        contact: contributor.contact,
      });
    }
  }, [contributor]);

  // Form handlers
  const handleRoleChange = (role: ContributorRoleType) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handlePositionChange = (position: ContributorPositionType) => {
    setFormData((prev) => ({
      ...prev,
      position: prev.position === position ? undefined : position,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleOrcidIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, orcidId: e.target.value }));
    // Clear error when input changes
    if (autoFillError) setAutoFillError(null);
  };

  const handleOrcidAutoFill = async (): Promise<boolean> => {
    if (!formData.orcidId || isConfluxUser) return false;

    setAutoFillError(null);

    try {
      const person = await apiClient.orcid_GetPersonFromOrcid(formData.orcidId);
      if (person) {
        setFormData((prev) => ({
          ...prev,
          name: person.name,
          email: person.email ?? "",
          orcidId: extractOrcidFromUrl(person.orcid_id) ?? "",
        }));
        return true;
      } else {
        setAutoFillError("No person found with this ORCID.");
        return false;
      }
    } catch (error) {
      console.error("Error searching ORCID:", error);
      setAutoFillError("Failed to search ORCID. Please try again.");
      return false;
    }
  };

  const resetForm = () => {
    if (contributor) {
      setFormData({
        name: contributor.person.name,
        email: contributor.person.email || "",
        orcidId: extractOrcidFromUrl(contributor.person.orcid_id) || "",
        roles: contributor.roles.map((role) => role.role_type),
        position: contributor.positions.find((p) => !p.end_date)?.position,
        leader: contributor.leader,
        contact: contributor.contact,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        orcidId: "",
        roles: [],
        position: undefined,
        leader: false,
        contact: false,
      });
    }
  };

  const saveEditedContributor = async (apiClient: ApiClient) => {
    if (!contributor) {
      throw new Error("No contributor selected");
    }

    // Only update person data if it's not a Conflux user
    if (!isConfluxUser) {
      const formattedOrcid = formData.orcidId
        ? formatOrcidAsUrl(formData.orcidId)
        : null;

      const personUpdateData = new PersonRequestDTO({
        name: formData.name,
        email: formData.email,
        or_ci_d: formattedOrcid ?? undefined,
      });

      await apiClient.people_UpdatePerson(
        contributor.person.id,
        personUpdateData,
      );
    }

    // Then update contributor data
    const contributorUpdateData = new ContributorRequestDTO({
      roles: formData.roles,
      position: formData.position,
      leader: formData.leader,
      contact: formData.contact,
    });

    const result = await apiClient.contributors_UpdateContributor(
      projectId,
      contributor.person.id,
      contributorUpdateData,
    );

    return result;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-0 bg-white/95 shadow-2xl backdrop-blur-md sm:max-w-[700px]">
        <DialogHeader className="space-y-3 border-b border-gray-100 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-lg bg-gray-100 p-2">
              <Pencil className="h-6 w-6 text-gray-600" />
            </div>
            Edit Contributor
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {!isConfluxUser && (
              <p className="mb-2">
                Update the contributor and person information for this project.
              </p>
            )}
            {isConfluxUser && (
              <div className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-amber-800">
                    Personal details cannot be edited for registered Conflux
                    users
                  </p>
                  <p className="mt-1 text-amber-700">
                    Name, email, and ORCID ID are managed through the user's
                    Conflux account. You can still update contributor-specific
                    details like roles, positions, and project settings.
                  </p>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <ApiMutation
          mutationFn={saveEditedContributor}
          data={{}}
          loadingMessage="Updating contributor..."
          mode="component"
          onSuccess={(updatedContributor) => {
            onContributorUpdated(updatedContributor);
            onOpenChange(false);
          }}
        >
          {({ onSubmit, isLoading, error }) => (
            <>
              <ContributorFormFields
                formData={formData}
                onNameChange={handleNameChange}
                onEmailChange={handleEmailChange}
                onOrcidIdChange={handleOrcidIdChange}
                onRoleChange={handleRoleChange}
                onPositionChange={handlePositionChange}
                onLeaderChange={(e) =>
                  setFormData((prev) => ({ ...prev, leader: e.target.checked }))
                }
                onContactChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact: e.target.checked,
                  }))
                }
                onOrcidAutoFill={handleOrcidAutoFill}
                orcidError={autoFillError}
                isEdit={true}
                isConfluxUser={isConfluxUser}
              />

              <DialogFooter className="flex gap-3 border-t border-gray-100 pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    resetForm();
                  }}
                  className="transition-all duration-200 hover:scale-105 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error.message}
                  </div>
                )}
                <Button
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </ApiMutation>
      </DialogContent>
    </Dialog>
  );
}
