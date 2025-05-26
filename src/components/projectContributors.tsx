/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProjectDTO,
  ContributorDTO,
  ApiClient,
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
import { ApiMutation } from "@/components/apiMutation";

type ProjectContributorsProps = {
  project: ProjectDTO;
  isAdmin?: boolean;
  onProjectUpdate: () => void;
};

/**
 * Project Contributors component with proper error handling
 * @param project the project containing contributors
 * @param onProjectUpdate callback to trigger project data refresh
 */
export default function ProjectContributors({
  project,
  isAdmin = false,
  onProjectUpdate,
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

  const handleContributorAdded = () => {
    // Trigger a project refresh instead of manually updating the array
    onProjectUpdate();
  };

  const handleContributorUpdated = () => {
    // Trigger a project refresh instead of manually updating the array
    onProjectUpdate();
    setEditingContributor(null);
  };

  const openDeleteDialog = (contributor: ContributorDTO) => {
    setDeleteContributor(contributor);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <CardHeader className="relative flex justify-between">
        <CardTitle className="text-xl font-semibold">Contributors</CardTitle>
        <div
          className={
            "absolute right-0 items-center justify-between space-x-4 px-4 group-hover:flex"
          }
        >
          {isAdmin && (
            <div className="invisible group-hover/card:visible">
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
          )}

          {/* Only show edit button if there are contributors and user is admin */}
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
          {project.contributors?.map((contributor) => (
            <div key={contributor.person.id} className="flex h-full flex-col">
              <ContributorCard
                id={contributor.person.id}
                name={contributor.person.name}
                email={contributor.person.email}
                orcidId={contributor.person.orcid_id}
                roles={contributor.roles}
                positions={contributor.positions}
                isLeader={contributor.leader}
                isContact={contributor.contact}
                editMode={editMode}
                onEdit={() => handleEditContributor(contributor)}
                onDelete={() => openDeleteDialog(contributor)}
                openDeleteDialog={() => openDeleteDialog(contributor)}
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
                    <ApiMutation
                      mutationFn={(apiClient: ApiClient) =>
                        apiClient.contributors_DeleteContributor(
                          project.id,
                          contributor.person.id,
                        )
                      }
                      data={{}}
                      loadingMessage="Deleting contributor..."
                      mode="component"
                      onSuccess={() => {
                        onProjectUpdate();
                        setIsDeleteDialogOpen(false);
                        setDeleteContributor(null);
                      }}
                    >
                      {({ onSubmit }) => (
                        <AlertDialogAction
                          className="border-destructive bg-destructive hover:text-destructive border-1 text-white hover:bg-white/10 hover:font-bold"
                          onClick={onSubmit}
                        >
                          Delete
                        </AlertDialogAction>
                      )}
                    </ApiMutation>
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
