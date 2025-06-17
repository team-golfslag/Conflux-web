/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ProjectResponseDTO,
  ContributorResponseDTO,
  ApiClient,
  UserRoleType,
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
import AddContributorModal from "@/components/contributor/addContributorModal";
import EditContributorModal from "@/components/contributor/editContributorModal";
import ContributorCard from "@/components/contributor/contributorCard";
import { ApiMutation } from "@/components/apiMutation";

type ProjectContributorsProps = {
  project: ProjectResponseDTO;
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
    useState<ContributorResponseDTO | null>(null);
  const [deleteContributor, setDeleteContributor] =
    useState<ContributorResponseDTO | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Check if a contributor can be deleted
  // Can delete if:
  // 1. No user is attached to the contributor, OR
  // 2. User is attached but no longer has the contributor role
  const canDeleteContributor = (
    contributor: ContributorResponseDTO,
  ): boolean => {
    // Can always delete if no user is attached
    if (!contributor.person.user_id) {
      return true;
    }

    // Find the user in the project's users list
    const attachedUser = project.users?.find(
      (user) => user.id === contributor.person.user_id,
    );

    // If user not found in project, allow deletion (shouldn't happen but safe fallback)
    if (!attachedUser) {
      return true;
    }

    // Check if user still has contributor role
    const hasContributorRole =
      attachedUser.roles?.some((role) => role.type === UserRoleType.Contributor) ?? false;

    // Can delete if user no longer has contributor role
    return !hasContributorRole;
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const handleEditContributor = (contributor: ContributorResponseDTO) => {
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

  const openDeleteDialog = (contributor: ContributorResponseDTO) => {
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
            <div className="invisible flex items-center gap-2 group-hover/card:visible">
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
          <div className="mb-4 rounded-md bg-amber-100 p-2 text-center text-sm text-amber-600">
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
                roles={contributor.roles.map((role) => role.role_type)}
                position={
                  contributor.positions.find((p) => !p.end_date)?.position
                }
                isConfluxUser={!!contributor.person.user_id}
                canDelete={canDeleteContributor(contributor)}
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
                      <strong>
                        In most cases you should end the user's position to
                        signify their departure from the project
                      </strong>
                      <br />
                      {contributor.person.user_id ? (
                        <>
                          This contributor is linked to a user account but no
                          longer has the contributor role.
                          <br />
                        </>
                      ) : null}
                      This will remove {contributor.person.name} from this
                      project and from any future syncs with RAiD. This action
                      cannot be undone.
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
        isConfluxUser={!!editingContributor?.person.user_id}
      />
    </>
  );
}
