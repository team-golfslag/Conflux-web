/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditSysAdminModal from "./editSysAdminModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Building2,
  GraduationCap,
  Ban,
} from "lucide-react";
import { ApiWrapper } from "@/components/apiWrapper";
import { ApiMutation } from "@/components/apiMutation";
import {
  UserResponseDTO,
  PermissionLevel,
  ApiClient,
} from "@team-golfslag/conflux-api-client/src/client";

interface SysAdminUsersListProps {
  refreshTrigger?: number;
}

export default function SysAdminUsersList({
  refreshTrigger: externalRefreshTrigger,
}: SysAdminUsersListProps) {
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<UserResponseDTO | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getRoleBadgeVariant = (role: PermissionLevel) => {
    return role === PermissionLevel.SuperAdmin ? "destructive" : "secondary";
  };

  const getRoleDisplayName = (role: PermissionLevel) => {
    return role === PermissionLevel.SuperAdmin ? "Super Admin" : "Sys Admin";
  };

  const handleEditUser = (user: UserResponseDTO) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (user: UserResponseDTO) => {
    setDeleteUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUserUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Administrator Users
              </CardTitle>
              <CardDescription>
                Manage system administrator accounts and their permissions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ApiWrapper
            queryFn={(apiClient) =>
              apiClient.admin_GetUsersByQuery(undefined, true)
            }
            dependencies={[refreshTrigger, externalRefreshTrigger]}
            loadingMessage="Loading system administrators..."
            mode="component"
          >
            {(users) => {
              return (
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Assigned Access</TableHead>
                          <TableHead className="w-[70px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <div className="flex items-center gap-2 font-medium">
                                  {user.person?.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.person?.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getRoleBadgeVariant(
                                  user.permission_level,
                                )}
                              >
                                {getRoleDisplayName(user.permission_level)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {user.permission_level ===
                                PermissionLevel.SuperAdmin ? (
                                  <div className="text-sm font-medium text-green-600">
                                    Full System Access
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    {user.assigned_organisations &&
                                      user.assigned_organisations.length >
                                        0 && (
                                        <div className="flex items-center gap-1 text-sm">
                                          <Building2 className="h-3 w-3" />
                                          {
                                            user.assigned_organisations.length
                                          }{" "}
                                          organizations
                                        </div>
                                      )}
                                    {user.assigned_lectorates &&
                                      user.assigned_lectorates.length > 0 && (
                                        <div className="flex items-center gap-1 text-sm">
                                          <GraduationCap className="h-3 w-3" />
                                          {user.assigned_lectorates.length}{" "}
                                          lectorates
                                        </div>
                                      )}
                                    {(!user.assigned_organisations ||
                                      user.assigned_organisations.length ===
                                        0) &&
                                      (!user.assigned_lectorates ||
                                        user.assigned_lectorates.length ===
                                          0) && (
                                        <div className="text-sm text-gray-400">
                                          No assignments
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.permission_level !==
                              PermissionLevel.SuperAdmin ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() => handleEditUser(user)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => openDeleteDialog(user)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove Admin Role
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center">
                                  <Ban className="h-4 w-4" />
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {users.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      No admin users found matching your search.
                    </div>
                  )}
                </div>
              );
            }}
          </ApiWrapper>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsDeleteDialogOpen(false);
            setDeleteUser(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Administrator Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the administrator role from{" "}
              <strong>{deleteUser?.person?.name}</strong>? This will downgrade
              their account to a regular user and remove all administrative
              privileges. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <ApiMutation
              mutationFn={(apiClient: ApiClient) =>
                apiClient.admin_SetUserPermissionLevel(
                  PermissionLevel.User,
                  deleteUser!.id,
                )
              }
              data={{}}
              loadingMessage="Removing administrator role..."
              mode="component"
              onSuccess={() => {
                handleUserUpdated();
                setIsDeleteDialogOpen(false);
                setDeleteUser(null);
              }}
            >
              {({ onSubmit }) => (
                <AlertDialogAction
                  className="border-destructive bg-destructive hover:text-destructive border-1 text-white hover:bg-white/10 hover:font-bold"
                  onClick={onSubmit}
                >
                  Remove Role
                </AlertDialogAction>
              )}
            </ApiMutation>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditSysAdminModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
}
