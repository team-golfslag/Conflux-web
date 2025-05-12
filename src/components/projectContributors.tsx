/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProjectDTO,
  ContributorDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import AddContributorModal from "@/components/addContributorModal";
import EditContributorModal from "@/components/editContributorModal";
import ContributorCard from "@/components/contributorCard";

type ProjectContributorsProps = {
  project: ProjectDTO;
};

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

  const toggleEditMode = () => setEditMode(!editMode);

  const handleEditContributor = (contributor: ContributorDTO) => {
    setEditingContributor(contributor);
    setIsEditModalOpen(true);
  };

  const handleContributorAdded = (newContributor: ContributorDTO) => {
    project.contributors = [...(project.contributors || []), newContributor];
  };

  const handleContributorUpdated = (updatedContributor: ContributorDTO) => {
    if (project.contributors) {
      const index = project.contributors.findIndex(
        (c) => c.person.id === updatedContributor.person.id,
      );
      if (index !== -1) {
        project.contributors[index] = updatedContributor;
      }
    }
    setEditingContributor(null);
  };

  const handleDeleteContributor = async () => {
    if (!deleteContributor) return;

    try {
      // API call would go here to delete the contributor
      // await apiClient.contributors_DeleteContributor(project.id, deleteContributor.person.id);

      // Update local state
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
        <div
          className={
            "absolute right-0 items-center justify-between space-x-4 px-4 group-hover:flex" +
            (editMode ? "" : " hidden")
          }
        >
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
            projectId={project.id}
            onContributorAdded={handleContributorAdded}
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
        contributor={editingContributor}
        projectId={project.id}
        onContributorUpdated={handleContributorUpdated}
      />
    </>
  );
}
