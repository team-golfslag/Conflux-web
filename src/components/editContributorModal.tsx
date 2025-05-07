/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

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
import { ContributorRoleType } from "@team-golfslag/conflux-api-client/src/client";

interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  leader: boolean;
  contact: boolean;
}

interface EditContributorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  formData: ContributorFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContributorFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (role: ContributorRoleType) => void;
  saveEditedContributor: () => Promise<void>;
  resetForm: () => void;
}

export default function EditContributorModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  handleInputChange,
  handleRoleChange,
  saveEditedContributor,
  resetForm,
}: Readonly<EditContributorModalProps>) {
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
          handleInputChange={handleInputChange}
          handleRoleChange={handleRoleChange}
          setFormData={setFormData}
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
            disabled={!formData.name || formData.roles.length === 0}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
