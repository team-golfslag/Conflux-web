/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ApiClient,
  ContributorResponseDTO,
  ContributorRoleType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Edit, X, Filter } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);

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

  const handleCheckRole = (b: boolean, role: string) => {
    if (b) {
      setFilteredRoles([...filteredRoles, role]);
    } else {
      setFilteredRoles(filteredRoles.filter((r) => r !== role));
    }
  };

  return (
    <>
      <CardHeader className="relative flex">
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

              <div className="visible">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-gray-100 bg-white/70 text-sm shadow-sm"
                    >
                      <>
                        <Filter></Filter>
                        {filteredRoles.length == 1 && (
                          <p>{filteredRoles.length} role</p>
                        )}
                        {filteredRoles.length > 1 && (
                          <p>{filteredRoles.length} roles</p>
                        )}
                      </>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="group/dropdown w-56">
                    <DropdownMenuLabel className="flex flex-row items-center justify-between">
                      <div>Filter by roles </div>

                      {filteredRoles.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFilteredRoles([]);
                          }}
                        >
                          <X size={4} className="mr-1" />
                        </Button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {Object.keys(ContributorRoleType).map((role) => (
                      <DropdownMenuCheckboxItem
                        checked={filteredRoles.includes(role)}
                        onCheckedChange={(b) => handleCheckRole(b, role)}
                      >
                        {role.toString()}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
          {project.contributors
            ?.filter(
              (c) =>
                filteredRoles.length === 0 ||
                filteredRoles.some((item) =>
                  c.roles.some((r) => r.role_type.toString() === item),
                ),
            )
            .map((contributor) => (
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
                          In most cases you should end the users position to
                          signify their departure from the project
                        </strong>
                        <br />
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
