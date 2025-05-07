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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, User } from "lucide-react";
import OrcidIcon from "@/components/icons/orcidIcon";
import ContributorFormFields from "./contributorFormFields";
import {
  ContributorRoleType,
  Person,
} from "@team-golfslag/conflux-api-client/src/client";

interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  leader: boolean;
  contact: boolean;
}

interface AddContributorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  formData: ContributorFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContributorFormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (role: ContributorRoleType) => void;
  addContributor: () => Promise<void>;
  orcidSearchTerm: string;
  setOrcidSearchTerm: (term: string) => void;
  searchByOrcid: () => Promise<void>;
  isLoadingOrcidSearch: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Person[];
  selectPerson: (person: Person) => void;
}

export default function AddContributorModal({
  isOpen,
  onOpenChange,
  formData,
  setFormData,
  handleInputChange,
  handleRoleChange,
  addContributor,
  orcidSearchTerm,
  setOrcidSearchTerm,
  searchByOrcid,
  isLoadingOrcidSearch,
  searchTerm,
  setSearchTerm,
  searchResults,
  selectPerson,
}: Readonly<AddContributorModalProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Contributor</DialogTitle>
          <DialogDescription>
            Add a new contributor to this project. You can search by ORCID or
            enter details manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="orcidSearch">Search by ORCID</Label>
              <div className="relative mt-2">
                <Input
                  id="orcidSearch"
                  value={orcidSearchTerm}
                  onChange={(e) => setOrcidSearchTerm(e.target.value)}
                  className="pl-8"
                  placeholder="0000-0000-0000-0000"
                />
                <OrcidIcon className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>
            <Button
              type="button"
              onClick={searchByOrcid}
              disabled={isLoadingOrcidSearch}
            >
              {isLoadingOrcidSearch ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="personSearch">Search for Existing People</Label>
              <div className="relative mt-2">
                <Input
                  id="personSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  placeholder="Search by name or email"
                />
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-md">
                  {searchResults.map((person) => (
                    <div
                      key={person.id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      onClick={() => selectPerson(person)}
                    >
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <span>{person.name}</span>
                      </div>
                      {person.email && (
                        <p className="text-muted-foreground text-xs">
                          {person.email}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ContributorFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            setFormData={setFormData}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={addContributor}
            disabled={!formData.name || formData.roles.length === 0}
          >
            Add Contributor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
