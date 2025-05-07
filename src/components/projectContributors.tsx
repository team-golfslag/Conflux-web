/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProjectDTO,
  ContributorDTO,
  ContributorRoleType,
  PersonDTO,
  Person,
} from "@team-golfslag/conflux-api-client/src/client";
import { Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useContext, useEffect, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ApiClientContext } from "@/lib/ApiClientContext";
import AddContributorModal from "@/components/addContributorModal";
import EditContributorModal from "@/components/editContributorModal";
import ContributorCard from "./contributorCard";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContributor, setEditingContributor] =
    useState<ContributorDTO | null>(null);
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
  const [isLoadingOrcidSearch, setIsLoadingOrcidSearch] = useState(false);
  const apiClient = useContext(ApiClientContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const toggleEditMode = () => setEditMode(!editMode);

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

  const searchByOrcid = async () => {
    setIsLoadingOrcidSearch(true);
    try {
      alert("ORCID search functionality not yet implemented on the backend");
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

  const selectPerson = (person: Person) => {
    setSelectedPerson(person);
    setFormData((prev) => ({
      ...prev,
      name: person.name,
      email: person.email || "",
      orcidId: person.orcid_id || "",
    }));
    setSearchResults([]);
    setSearchTerm("");
  };

  const resetFormData = () => {
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
  };

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
        if (!personToUse || !personToUse.id) {
          throw new Error("Failed to create person");
        }
      }

      const newContributor = new ContributorDTO({
        person: personToUse,
        project_id: project.id,
        roles: formData.roles,
        positions: [],
        leader: formData.leader,
        contact: formData.contact,
      });

      const createdContributor = await apiClient.contributors_CreateContributor(
        project.id,
        newContributor,
      );

      if (!createdContributor || !createdContributor.person) {
        throw new Error("Server returned an invalid contributor");
      }

      project.contributors = [
        ...(project.contributors || []),
        createdContributor,
      ];
      setIsAddModalOpen(false);
      resetFormData();
    } catch (error) {
      console.error("Error adding contributor:", error);
      alert(
        `Failed to add contributor: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const handleEditContributor = (contributor: ContributorDTO) => {
    setEditingContributor(contributor);
    setFormData({
      name: contributor.person.name,
      email: contributor.person.email || "",
      orcidId: contributor.person.orcid_id || "",
      roles: contributor.roles,
      leader: contributor.leader,
      contact: contributor.contact,
    });
    setIsEditModalOpen(true);
  };

  const saveEditedContributor = async () => {
    if (!editingContributor) return;
    try {
      const updatedPerson = new PersonDTO({
        name: formData.name,
        email: formData.email,
        or_ci_d: formData.orcidId || undefined,
      });

      const updatedContributor = new ContributorDTO({
        person: editingContributor.person,
        project_id: project.id,
        roles: formData.roles,
        positions: editingContributor.positions || [],
        leader: formData.leader,
        contact: formData.contact,
      });

      await apiClient.people_UpdatePerson(
        editingContributor.person.id,
        updatedPerson,
      );
      const result = await apiClient.contributors_UpdateContributor(
        project.id,
        editingContributor.person.id,
        updatedContributor,
      );

      if (project.contributors) {
        const index = project.contributors.findIndex(
          (c) => c.person.id === editingContributor.person.id,
        );
        if (index !== -1) {
          project.contributors[index] = result;
        }
      }

      setIsEditModalOpen(false);
      setEditingContributor(null);
      resetFormData();
    } catch (error) {
      console.error("Error updating contributor:", error);
      alert(
        `Failed to update contributor: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const handleDeleteContributor = async () => {
    if (!deleteContributor) return;

    try {
      // For now, we'll remove the contributor from the local state
      if (project.contributors) {
        project.contributors = project.contributors.filter(
          (c) => c.person.id !== deleteContributor.person.id,
        );
      }

      setIsDeleteDialogOpen(false);
      setDeleteContributor(null);
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

          <AddContributorModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            addContributor={addContributor}
            orcidSearchTerm={orcidSearchTerm}
            setOrcidSearchTerm={setOrcidSearchTerm}
            searchByOrcid={searchByOrcid}
            isLoadingOrcidSearch={isLoadingOrcidSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchResults={searchResults}
            selectPerson={selectPerson}
          />
        </div>
      </CardHeader>

      <CardContent>
        {editMode && (
          <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-2 text-center text-sm">
            Edit mode active. You can edit or delete contributors from the
            project.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.users?.map((user) => (
            <ContributorCard
              key={user.scim_id}
              id={user.scim_id}
              name={user.name}
              email={user.email}
              orcidId={user.or_ci_d}
              roles={user.roles}
              isConfluxUser
              editMode={editMode}
            />
          ))}

          {project.contributors?.map((contributor) => (
            <div key={contributor.person.id}>
              <ContributorCard
                id={contributor.person.id}
                name={contributor.person.name}
                email={contributor.person.email}
                orcidId={contributor.person.orcid_id}
                roles={contributor.roles}
                isLeader={contributor.leader}
                isContact={contributor.contact}
                editMode={editMode}
                onEdit={() => handleEditContributor(contributor)}
                onDelete={handleDeleteContributor}
                openDeleteDialog={() => {
                  setDeleteContributor(contributor);
                  setIsDeleteDialogOpen(true);
                }}
              />
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
                      className="bg-destructive hover:text-destructive border-destructive border-1 text-white hover:bg-white/10 hover:font-bold"
                      onClick={handleDeleteContributor}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </CardContent>

      <EditContributorModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleRoleChange={handleRoleChange}
        saveEditedContributor={saveEditedContributor}
        resetForm={() => {
          setEditingContributor(null);
          resetFormData();
        }}
      />
    </>
  );
}
