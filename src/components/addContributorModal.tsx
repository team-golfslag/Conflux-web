/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState, useContext, useEffect, useCallback, useRef } from "react";
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
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, User, AlertCircle } from "lucide-react";
import OrcidIcon from "@/components/icons/orcidIcon";
import ContributorFormFields from "./contributorFormFields";
import {
  ContributorRoleType,
  Person,
  PersonDTO,
  ContributorDTO,
  ContributorPositionDTO,
  ContributorPositionType,
  ApiClient,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  formatOrcidAsUrl,
  extractOrcidFromUrl,
} from "@/lib/formatters/orcidFormatter";
import { ApiMutation } from "@/components/apiMutation";
import { getLevenshteinDistance } from "@/lib/utils";

interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  positions: ContributorPositionType[];
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
    positions: [],
    leader: false,
    contact: false,
  });

  // Search state
  const [orcidSearchTerm, setOrcidSearchTerm] = useState("");
  const [isLoadingOrcidSearch, setIsLoadingOrcidSearch] = useState(false);
  const [orcidSearchResults, setOrcidSearchResults] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Ref for click-outside detection
  const orcidSearchContainerRef = useRef<HTMLDivElement>(null);

  const apiClient = useContext(ApiClientContext);

  // Form handlers
  const handleRoleChange = (role: ContributorRoleType) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
    setSelectedPerson(null);
  };

  const handlePositionChange = (position: ContributorPositionType) => {
    setFormData((prev) => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter((p) => p !== position)
        : [...prev.positions, position],
    }));
    setSelectedPerson(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      orcidId: "",
      roles: [],
      positions: [],
      leader: false,
      contact: false,
    });
    setSelectedPerson(null);
    setOrcidSearchTerm("");
    setSearchTerm("");
    setSearchResults([]);
    setOrcidSearchResults([]);
    setSearchError(null);
    setAutoFillError(null);
  };

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // ORCID search
  const searchInOrcid = async () => {
    if (!orcidSearchTerm || orcidSearchTerm.length < 3) {
      setOrcidSearchResults([]);
      return;
    }

    setIsLoadingOrcidSearch(true);
    setSearchError(null);

    try {
      const results = await apiClient.orcid_GetPersonByQuery(orcidSearchTerm);
      // sort results by getLevenshteinDistance
      results.sort((a, b) => {
        const distanceA = getLevenshteinDistance(a.name, orcidSearchTerm);
        const distanceB = getLevenshteinDistance(b.name, orcidSearchTerm);
        return distanceA - distanceB;
      });

      setOrcidSearchResults(results);
    } catch (error) {
      console.error("Error searching ORCID database:", error);
      setSearchError("Failed to search ORCID database. Please try again.");
      setOrcidSearchResults([]);
    } finally {
      setIsLoadingOrcidSearch(false);
    }
  };

  // ORCID autofill from the form field
  const handleOrcidAutoFill = async () => {
    if (!formData.orcidId) return false;

    setAutoFillError(null);

    try {
      const person = await apiClient.orcid_GetPersonFromOrcid(formData.orcidId);
      if (person) {
        setSelectedPerson(person);
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
        setSearchError(null);
        const people = await apiClient.people_GetPersonsByQuery(query);
        setSearchResults(people);
      } catch (error) {
        console.error("Error searching for people:", error);
        setSearchError("Failed to search for people. Please try again.");
        setSearchResults([]);
      }
    },
    [apiClient],
  );

  // Use the debounce hook for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effect to search people when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchPeople(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchPeople, debouncedSearchTerm]);

  // Click outside handler to dismiss search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close ORCID search results if clicked outside
      if (
        orcidSearchContainerRef.current &&
        !orcidSearchContainerRef.current.contains(event.target as Node)
      ) {
        setOrcidSearchResults([]);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle person selection
  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setFormData((prev) => ({
      ...prev,
      name: person.name,
      email: person.email ?? "",
      orcidId: extractOrcidFromUrl(person.orcid_id) ?? "",
    }));
    setSearchResults([]);
    setSearchTerm("");
  };

  // Prepare data for API mutation
  const prepareContributorData = async (): Promise<{
    contributorData: ContributorDTO;
    newPerson?: PersonDTO;
  }> => {
    let personToUse: Person;
    let newPerson: PersonDTO | undefined;

    if (selectedPerson) {
      personToUse = selectedPerson;
    } else {
      const formattedOrcid = formData.orcidId
        ? formatOrcidAsUrl(formData.orcidId)
        : null;
      newPerson = new PersonDTO({
        name: formData.name,
        email: formData.email,
        or_ci_d: formattedOrcid ?? undefined,
      });

      // We'll use a temporary person object until the actual creation
      personToUse = new Person({
        id: "temp-id", // Will be replaced by the actual created person
        name: formData.name,
        email: formData.email,
        orcid_id: formattedOrcid ?? undefined,
        schema_uri: "",
      });
    }

    const contributorData = new ContributorDTO({
      person: personToUse,
      project_id: projectId,
      roles: formData.roles,
      positions: formData.positions.map(
        (type) => new ContributorPositionDTO({ type, start_date: new Date() }),
      ),
      leader: formData.leader,
      contact: formData.contact,
    });

    return { contributorData, newPerson };
  };

  // Create or get person, then create contributor
  const createContributor = async (apiClient: ApiClient) => {
    const { contributorData, newPerson } = await prepareContributorData();

    // If we need to create a new person first
    if (newPerson) {
      const createdPerson = await apiClient.people_CreatePerson(newPerson);
      if (!createdPerson?.id) {
        throw new Error("Failed to create person");
      }

      // Update the contributor with the created person
      contributorData.person = createdPerson;
    }

    // Now create the contributor
    return apiClient.contributors_CreateContributor(projectId, contributorData);
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

        <ApiMutation
          mutationFn={createContributor}
          data={{}}
          loadingMessage="Adding contributor..."
          mode="component"
          onSuccess={(createdContributor) => {
            onContributorAdded(createdContributor);
            onOpenChange(false);
            resetForm();
          }}
        >
          {({ onSubmit, isLoading, error }) => (
            <>
              <div className="space-y-4 py-4">
                {searchError && (
                  <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{searchError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Label htmlFor="orcidSearch">Search in ORCID</Label>
                      <div className="relative mt-2">
                        <Input
                          id="orcidSearch"
                          value={orcidSearchTerm}
                          onChange={(e) => setOrcidSearchTerm(e.target.value)}
                          className="pl-8"
                          placeholder="Name or keyword"
                        />
                        <OrcidIcon className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={searchInOrcid}
                      disabled={isLoadingOrcidSearch}
                    >
                      {isLoadingOrcidSearch ? "Searching..." : "Search"}
                    </Button>
                  </div>

                  {orcidSearchResults && orcidSearchResults.length > 0 && (
                    <div
                      ref={orcidSearchContainerRef}
                      className="mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-md"
                    >
                      {orcidSearchResults.map((person) => (
                        <button
                          key={person.id}
                          className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => selectPerson(person)}
                        >
                          <div className="flex items-center gap-2">
                            <OrcidIcon className="h-4 w-4" />
                            <span>{person.name}</span>
                          </div>
                          {person.email && (
                            <p className="text-muted-foreground text-xs">
                              {person.email}
                            </p>
                          )}
                          {person.orcid_id && (
                            <p className="text-muted-foreground text-xs">
                              ORCID: {extractOrcidFromUrl(person.orcid_id)}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="personSearch">
                      Search for Existing People
                    </Label>
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
                            className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
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
                            {person.orcid_id && (
                              <p className="text-muted-foreground text-xs">
                                ORCID: {extractOrcidFromUrl(person.orcid_id)}
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
                  onNameChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    setSelectedPerson(null);
                  }}
                  onEmailChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setSelectedPerson(null);
                  }}
                  onOrcidIdChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      orcidId: e.target.value,
                    }));
                    // Clear error when input changes
                    if (autoFillError) setAutoFillError(null);
                    setSelectedPerson(null);
                  }}
                  onRoleChange={handleRoleChange}
                  onPositionChange={handlePositionChange}
                  orcidError={autoFillError}
                  onLeaderChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      leader: e.target.checked,
                    }));
                    setSelectedPerson(null);
                  }}
                  onContactChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      contact: e.target.checked,
                    }));
                    setSelectedPerson(null);
                  }}
                  onOrcidAutoFill={handleOrcidAutoFill}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
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
                    formData.positions.length === 0
                  }
                >
                  {isLoading ? "Adding..." : "Add Contributor"}
                </Button>
              </DialogFooter>
            </>
          )}
        </ApiMutation>
      </DialogContent>
    </Dialog>
  );
}
