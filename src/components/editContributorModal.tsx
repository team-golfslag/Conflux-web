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
  ContributorPositionDTO,
  ContributorPositionType,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";


interface ContributorFormData {
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
    roles: [],
    positions: [],
    leader: false,
    contact: false,
  });

  const apiClient = useContext(ApiClientContext);

  // Update form when contributor changes
  useEffect(() => {
    if (contributor) {
      setFormData({
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


  const resetForm = () => {
    if (contributor) {
      setFormData({
        roles: contributor.roles,
        positions: contributor.positions?.map((p) => p.type) ?? [],
        leader: contributor.leader,
        contact: contributor.contact,
      });
    } else {
      setFormData({
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
          onRoleChange={handleRoleChange}
          onPositionChange={handlePositionChange}
          onLeaderChange={(e) =>
            setFormData((prev) => ({ ...prev, leader: e.target.checked }))
          }
          onContactChange={(e) =>
            setFormData((prev) => ({ ...prev, contact: e.target.checked }))
          }
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
            disabled={formData.positions.length === 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
