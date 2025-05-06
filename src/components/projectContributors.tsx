/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProjectDTO,
  ContributorDTO,
  ContributorRoleType,
  PersonDTO,
  Person,
} from "@team-golfslag/conflux-api-client/src/client";
import {
  Edit,
  Plus,
  Trash2,
  X,
  Check,
  Crown,
  Contact,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useContext, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ApiClientContext } from "@/lib/ApiClientContext";
import OrcidIcon from "@/components/icons/orcidIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRoleDisplay } from "@/lib/formatters/roleFormatter";
import Logo from "./icons/logo";

type ProjectContributorsProps = {
  project: ProjectDTO;
};

// Interface for the new contributor form
interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  leader: boolean;
  contact: boolean;
}

/**
 * Project Contributors component
 * @param props the people to be turned into a card
 */
export default function ProjectContributors({
  project,
}: Readonly<ProjectContributorsProps>) {
  const [editMode, setEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteContributor, setDeleteContributor] =
    useState<ContributorDTO | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ContributorFormData>({
    name: "",
    email: "",
    orcidId: "",
    roles: [],
    leader: false,
    contact: false,
  });
  const [orcidSearchTerm, setOrcidSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiClient = useContext(ApiClientContext);

  // Track copied person IDs with a map of ID to copy status
  const [copiedIds, setCopiedIds] = useState<Record<string, boolean>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Function to copy ORCID ID to clipboard
  const copyOrcidToClipboard = (personId: string, orcidId: string) => {
    navigator.clipboard.writeText(orcidId).then(() => {
      // Set the copied state for this specific person ID
      setCopiedIds((prev) => ({
        ...prev,
        [personId]: true,
      }));

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedIds((prev) => ({
          ...prev,
          [personId]: false,
        }));
      }, 2000);
    });
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle role selection
  const handleRoleChange = (role: ContributorRoleType) => {
    if (formData.roles.includes(role)) {
      setFormData({
        ...formData,
        roles: formData.roles.filter((r) => r !== role),
      });
    } else {
      setFormData({
        ...formData,
        roles: [...formData.roles, role],
      });
    }
  };

  // Search by ORCID
  const searchByOrcid = async () => {
    setIsLoading(true);
    try {
      // This API endpoint doesn't exist yet - placeholder
      // In the future, this would call the ORCID search API
      alert("ORCID search functionality not yet implemented on the backend");

      // Mock successful ORCID search for demo purposes
      if (orcidSearchTerm) {
        // Simulate API response delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setFormData({
          ...formData,
          name: "Jane Doe", // Example data
          email: "jane.doe@example.com",
          orcidId: orcidSearchTerm,
        });
      }
    } catch (error) {
      console.error("Error searching ORCID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search for existing people
  const searchPeople = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const people = await apiClient.people_GetPersonsByQuery(query);
        setSearchResults(people);
      } catch (error) {
        console.error("Error searching for people:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [apiClient, setSearchResults, setIsSearching],
  );

  // Handle search input change with debounce
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

  // Select a person from search results
  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setFormData({
      ...formData,
      name: person.name,
      email: person.email || "",
      orcidId: person.orcid_id || "",
    });
    setSearchResults([]);
    setSearchTerm("");
  };

  // Add a new contributor
  const addContributor = async () => {
    try {
      let personToUse: Person;

      // If a person was selected from search results, use that person
      if (selectedPerson) {
        personToUse = selectedPerson;
      } else {
        // Otherwise create a new person
        const personDTO = new PersonDTO({
          name: formData.name,
          email: formData.email,
          or_ci_d: formData.orcidId || undefined,
        });

        // Call API to create the person
        personToUse = await apiClient.people_CreatePerson(personDTO);

        if (!personToUse || !personToUse.id) {
          throw new Error("Failed to create person");
        }
      }

      // Create contributor with the person's ID
      const newContributor = new ContributorDTO({
        person: personToUse,
        project_id: project.id,
        roles: formData.roles,
        positions: [],
        leader: formData.leader,
        contact: formData.contact,
      });

      // Call API to add contributor
      const createdContributor = await apiClient.contributors_CreateContributor(
        project.id,
        newContributor,
      );

      // Add the new contributor to the project's contributors list
      project.contributors = [...project.contributors, createdContributor];

      // Close modal and reset form
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        email: "",
        orcidId: "",
        roles: [],
        leader: false,
        contact: false,
      });
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error adding contributor:", error);
      alert(
        `Failed to add contributor: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Delete a contributor
  const handleDeleteContributor = async () => {
    if (!deleteContributor) return;

    try {
      // This API endpoint might need to be implemented
      // Ideally we would have a dedicated endpoint to remove a contributor from a project
      alert("Delete functionality not yet implemented on the backend");

      setIsDeleteDialogOpen(false);
      setDeleteContributor(null);

      // Ideally, we would refresh the project data here
    } catch (error) {
      console.error("Error deleting contributor:", error);
    }
  };

  return (
    <>
      <CardHeader className="relative flex justify-between">
        <CardTitle className="text-xl font-semibold">Contributors</CardTitle>
        <div className="absolute right-0 flex items-center justify-between space-x-4 px-4">
          <Button variant="outline" size="sm" onClick={toggleEditMode}>
            {editMode ? (
              <>
                <X className="mr-2 h-4 w-4" /> Exit Edit Mode
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </>
            )}
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                  Add a new contributor to this project. You can search by ORCID
                  or enter details manually.
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
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

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      className="col-span-3"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      className="col-span-3"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="orcidId" className="text-right">
                      ORCID ID
                    </Label>
                    <Input
                      id="orcidId"
                      name="orcidId"
                      className="col-span-3"
                      value={formData.orcidId}
                      onChange={handleInputChange}
                      placeholder="0000-0000-0000-0000"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="pt-2 text-right">Roles</Label>
                    <div className="col-span-3 flex flex-wrap gap-2">
                      {Object.values(ContributorRoleType).map((role) => {
                        const roleDisplay = getRoleDisplay(role);
                        return (
                          <TooltipProvider key={role}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  key={role}
                                  variant={
                                    formData.roles.includes(role)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => handleRoleChange(role)}
                                >
                                  {roleDisplay.short}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {roleDisplay.long}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="leader" className="text-right">
                      Leader
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="leader"
                        checked={formData.leader}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, leader: checked })
                        }
                      />
                      <Label
                        htmlFor="leader"
                        className="text-muted-foreground text-sm"
                      >
                        Mark as project leader
                      </Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Contact
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="contact"
                        checked={formData.contact}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, contact: checked })
                        }
                      />
                      <Label
                        htmlFor="contact"
                        className="text-muted-foreground text-sm"
                      >
                        Mark as contact person
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
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
        </div>
      </CardHeader>

      <CardContent>
        {editMode && (
          <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-2 text-center text-sm">
            Edit mode active. You can delete contributors from the project.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Display Users as non-editable contributors first */}
          {project.users?.map((user) => (
            <Card
              key={user.scim_id}
              className="flex flex-col border border-blue-100 p-3 shadow-sm"
            >
              {/* User info section */}
              <div className="flex justify-between">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{user.name}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Logo size="16" />
                          </TooltipTrigger>
                          <TooltipContent>Conflux User</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {user.or_ci_d && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0"
                              onClick={() =>
                                copyOrcidToClipboard(
                                  user.scim_id,
                                  user.or_ci_d!,
                                )
                              }
                            >
                              {copiedIds[user.scim_id] ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <OrcidIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedIds[user.scim_id]
                              ? "Copied!"
                              : "Click to copy ORCID"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {user.email && (
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Badges pushed to bottom */}
              <div className="mt-auto flex flex-wrap gap-1 pt-1">
                {user.roles.map((role) => (
                  <Badge
                    key={role.urn}
                    variant="secondary"
                    className="h-5 px-2 py-0 text-xs"
                  >
                    {role.name}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}

          {/* Display regular contributors */}
          {project.contributors?.map((contributor) => (
            <Card
              key={contributor.person.id}
              className={`flex flex-col border ${
                editMode ? "border-destructive/30" : "border-gray-200"
              } p-3 shadow-sm`}
            >
              <div className="flex justify-between">
                <div className="flex justify-between">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {contributor.person.name}
                        </p>
                        {contributor.leader && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Crown className="h-4 w-4 text-amber-500" />
                              </TooltipTrigger>
                              <TooltipContent>Project Leader</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {contributor.contact && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Contact className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>Contact Person</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {contributor.person.orcid_id && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0"
                                onClick={() =>
                                  copyOrcidToClipboard(
                                    contributor.person.id,
                                    contributor.person.orcid_id!,
                                  )
                                }
                              >
                                {copiedIds[contributor.person.id] ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <OrcidIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copiedIds[contributor.person.id]
                                ? "Copied!"
                                : "Click to copy ORCID"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    {contributor.person.email && (
                      <p className="text-muted-foreground text-xs">
                        {contributor.person.email}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {contributor.roles.map((role) => {
                      const roleDisplay = getRoleDisplay(role);
                      return (
                        <TooltipProvider key={role}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="h-5 px-2 py-0 text-xs"
                              >
                                {roleDisplay.short}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {roleDisplay.long}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>

                {editMode && (
                  <AlertDialog
                    open={
                      isDeleteDialogOpen &&
                      deleteContributor?.person.id === contributor.person.id
                    }
                    onOpenChange={(isOpen) => {
                      if (!isOpen) {
                        setIsDeleteDialogOpen(false);
                        setDeleteContributor(null);
                      }
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setDeleteContributor(contributor);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove {contributor.person.name} from this
                          project. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground"
                          onClick={handleDeleteContributor}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </>
  );
}
