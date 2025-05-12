/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState, useContext, useEffect, useCallback } from "react";
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
  PersonDTO,
  ContributorDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";

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
  projectId: string;
  onContributorAdded: (contributor: ContributorDTO) => void;
}

export default function AddContributorModal({
  isOpen,
  onOpenChange,
  projectId,
  onContributorAdded,
}: Readonly<AddContributorModalProps>) {
  // Form state
  const [formData, setFormData] = useState<ContributorFormData>({
    name: "",
    email: "",
    orcidId: "",
    roles: [],
    leader: false,
    contact: false,
  });

  // Search state
  const [orcidSearchTerm, setOrcidSearchTerm] = useState("");
  const [isLoadingOrcidSearch, setIsLoadingOrcidSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const apiClient = useContext(ApiClientContext);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: ContributorRoleType) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      orcidId: "",
      roles: [],
      leader: false,
      contact: false,
    });
    setSelectedPerson(null);
    setOrcidSearchTerm("");
    setSearchTerm("");
    setSearchResults([]);
  };

  // ORCID search
  const searchByOrcid = async () => {
    setIsLoadingOrcidSearch(true);
    try {
      // This would be replaced with actual API call when implemented
      if (orcidSearchTerm) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setFormData((prev) => ({
          ...prev,
          name: "Jane Doe",
          email: "jane.doe@example.com",
          orcidId: orcidSearchTerm,
        }));
      }
    } catch (error) {
      console.error("Error searching ORCID:", error);
    } finally {
      setIsLoadingOrcidSearch(false);
    }
  };

  // Person search
  const searchPeople = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const people = await apiClient.people_GetPersonsByQuery(query);
        setSearchResults(people);
      } catch (error) {
        console.error("Error searching for people:", error);
        setSearchResults([]);
      }
    },
    [apiClient],
  );

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        searchPeople(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchPeople, searchTerm]);

  // Handle person selection
  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setFormData((prev) => ({
      ...prev,
      name: person.name,
      email: person.email ?? "",
      orcidId: person.orcid_id ?? "",
    }));
    setSearchResults([]);
    setSearchTerm("");
  };

  // Add contributor
  const addContributor = async () => {
    try {
      let personToUse: Person;
      if (selectedPerson) {
        personToUse = selectedPerson;
      } else {
        const personDTO = new PersonDTO({
          name: formData.name,
          email: formData.email,
          or_ci_d: formData.orcidId || undefined,
        });
        personToUse = await apiClient.people_CreatePerson(personDTO);
        if (!personToUse?.id) {
          throw new Error("Failed to create person");
        }
      }

      const newContributor = new ContributorDTO({
        person: personToUse,
        project_id: projectId,
        roles: formData.roles,
        positions: [],
        leader: formData.leader,
        contact: formData.contact,
      });

      const createdContributor = await apiClient.contributors_CreateContributor(
        projectId,
        newContributor,
      );

      if (!createdContributor?.person) {
        throw new Error("Server returned an invalid contributor");
      }

      onContributorAdded(createdContributor);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding contributor:", error);
      alert(
        `Failed to add contributor: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
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
                <div className="absolute z-10 mt-1 max-h-40 w-full max-w-md overflow-y-auto rounded-md border bg-white shadow-md">
                  {searchResults.map((person) => (
                    <button
                      key={person.id}
                      className="w-full cursor-pointer px-4 py-2 hover:bg-gray-100"
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
                    </button>
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
