/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContributorFormFields from "./contributorFormFields";
import {
  ContributorRoleType,
  ContributorDTO,
  PersonDTO,
  ContributorPositionDTO,
  ContributorPositionType,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  formatOrcidAsUrl,
  extractOrcidFromUrl,
} from "@/lib/formatters/orcidFormatter";

interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  positions: ContributorPositionType[];
  leader: boolean;
  contact: boolean;
}

interface EditContributorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contributor: ContributorDTO | null;
  projectId: string;
  onContributorUpdated: (contributor: ContributorDTO) => void;
}

export default function EditContributorModal({
  isOpen,
  onOpenChange,
  contributor,
  projectId,
  onContributorUpdated,
}: Readonly<EditContributorModalProps>) {
  const [formData, setFormData] = useState<ContributorFormData>({
    name: "",
    email: "",
    orcidId: "",
    roles: [],
    positions: [],
    leader: false,
    contact: false,
  });
  const [orcidError, setOrcidError] = useState<string | null>(null);
  const [, setIsLoadingOrcidSearch] = useState(false);

  const apiClient = useContext(ApiClientContext);

  // Update form when contributor changes
  useEffect(() => {
    if (contributor) {
      setFormData({
        name: contributor.person.name,
        email: contributor.person.email ?? "",
        orcidId: extractOrcidFromUrl(contributor.person.orcid_id) ?? "",
        roles: contributor.roles,
        positions: contributor.positions?.map((p) => p.type) ?? [],
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
      positions: prev.positions.includes(position)
        ? prev.positions.filter((p) => p !== position)
        : [...prev.positions, position],
    }));
  };

  // ORCID autofill from the form field
  const handleOrcidAutoFill = async () => {
    if (!formData.orcidId) return false;

    setIsLoadingOrcidSearch(true);
    setOrcidError(null);

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
        setOrcidError("No person found with this ORCID.");
        return false;
      }
    } catch (error) {
      console.error("Error searching ORCID:", error);
      setOrcidError("Failed to search ORCID. Please try again.");
      return false;
    } finally {
      setIsLoadingOrcidSearch(false);
    }
  };

  const resetForm = () => {
    setOrcidError(null);

    if (contributor) {
      setFormData({
        name: contributor.person.name,
        email: contributor.person.email ?? "",
        orcidId: extractOrcidFromUrl(contributor.person.orcid_id) ?? "",
        roles: contributor.roles,
        positions: contributor.positions?.map((p) => p.type) ?? [],
        leader: contributor.leader,
        contact: contributor.contact,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        orcidId: "",
        roles: [],
        positions: [],
        leader: false,
        contact: false,
      });
    }
  };

  const saveEditedContributor = async () => {
    if (!contributor) return;
    try {
      const updatedPerson = new PersonDTO({
        name: formData.name,
        email: formData.email,
        or_ci_d: formData.orcidId
          ? (formatOrcidAsUrl(formData.orcidId) ?? undefined)
          : undefined,
      });

      const updatedContributor = new ContributorDTO({
        person: contributor.person,
        project_id: projectId,
        roles: formData.roles,
        positions: formData.positions.map(
          (type) =>
            new ContributorPositionDTO({ type, start_date: new Date() }),
        ),
        leader: formData.leader,
        contact: formData.contact,
      });

      await apiClient.people_UpdatePerson(contributor.person.id, updatedPerson);

      const result = await apiClient.contributors_UpdateContributor(
        projectId,
        contributor.person.id,
        updatedContributor,
      );

      onContributorUpdated(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating contributor:", error);
      alert(
        `Failed to update contributor: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Contributor</DialogTitle>
          <DialogDescription>
            Update the contributor information for this project.
          </DialogDescription>
        </DialogHeader>

        <ContributorFormFields
          formData={formData}
          onNameChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          onEmailChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          onOrcidIdChange={(e) => {
            setFormData((prev) => ({ ...prev, orcidId: e.target.value }));
            // Clear error when input changes
            if (orcidError) setOrcidError(null);
          }}
          onRoleChange={handleRoleChange}
          onPositionChange={handlePositionChange}
          onLeaderChange={(e) =>
            setFormData((prev) => ({ ...prev, leader: e.target.checked }))
          }
          onContactChange={(e) =>
            setFormData((prev) => ({ ...prev, contact: e.target.checked }))
          }
          onOrcidAutoFill={handleOrcidAutoFill}
          orcidError={orcidError}
          isEdit={true}
        />

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
          <Button
            onClick={saveEditedContributor}
            disabled={!formData.name || formData.positions.length === 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
