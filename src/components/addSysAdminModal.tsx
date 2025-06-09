/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht Universit      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl">
        <DialogHeader className="space-y-3 pb-6 border-b border-gray-100">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-gray-100">
              <UserCog className="h-6 w-6 text-gray-600" />
            </div>
            Add System Administrator
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Create a new system administrator account by linking to an existing
            user in the system and assigning appropriate permissions.
          </DialogDescription>
        </DialogHeader>tment of Information and Computing Sciences)
 */

import { useCallback, useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiMutation } from "@/components/apiMutation";
import { ApiClientContext } from "@/lib/ApiClientContext";
import {
  UserResponseDTO,
  PermissionLevel,
} from "@team-golfslag/conflux-api-client/src/client";
import { Search, User, AlertCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface AddSysAdminModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUserAdded?: () => void;
}

interface AdminFormData {
  assignedOrganizations: string[];
  assignedLectorates: string[];
}

export default function AddSysAdminModal({
  isOpen,
  onOpenChange,
  onUserAdded,
}: AddSysAdminModalProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    assignedOrganizations: [],
    assignedLectorates: [],
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<UserResponseDTO[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponseDTO | null>(
    null,
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [lectorates, setLectorates] = useState<string[]>([]);
  const apiClient = useContext(ApiClientContext);

  // Load organizations and lectorates when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [orgsData, lectsData] = await Promise.all([
            apiClient.admin_GetOrganisations(),
            apiClient.admin_GetLectorates(),
          ]);
          setOrganizations(orgsData);
          setLectorates(lectsData);
        } catch (error) {
          console.error("Failed to load organizations and lectorates:", error);
        }
      };
      loadData();
    }
  }, [isOpen, apiClient]);

  const resetForm = () => {
    setFormData({
      assignedOrganizations: [],
      assignedLectorates: [],
    });
    setSelectedUser(null);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleOrganizationToggle = (orgId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedOrganizations: checked
        ? [...prev.assignedOrganizations, orgId]
        : prev.assignedOrganizations.filter((id) => id !== orgId),
    }));
  };

  const handleLectorateToggle = (lectId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedLectorates: checked
        ? [...prev.assignedLectorates, lectId]
        : prev.assignedLectorates.filter((id) => id !== lectId),
    }));
  };

  const createSysAdminUser = async () => {
    if (!selectedUser) {
      throw new Error("You must select an existing user");
    }

    // Create the admin user
    await apiClient.admin_SetUserPermissionLevel(
      PermissionLevel.SystemAdmin,
      selectedUser.id,
    );

    // Assign organizations if any
    await apiClient.admin_AssignOrganisationsToUser(
      formData.assignedOrganizations,
      selectedUser.id,
    );

    // Assign lectorates if any
    await apiClient.admin_AssignLectoratesToUser(
      formData.assignedLectorates,
      selectedUser.id,
    );

    // Reset form and notify parent component
    resetForm();
    if (onUserAdded) {
      onUserAdded();
    }
  };

  const searchUsers = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchError(null);
        const users = await apiClient.admin_GetUsersByQuery(query, false);
        setSearchResults(users);
      } catch (error) {
        console.error("Error searching for users:", error);
        setSearchError("Failed to search for users. Please try again.");
        setSearchResults([]);
      }
    },
    [apiClient],
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers(debouncedSearchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchUsers, debouncedSearchTerm]);

  const selectUser = (user: UserResponseDTO) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchTerm("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add System Administrator</DialogTitle>
          <DialogDescription>
            Create a new system administrator account by linking to an existing
            user in the system.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1 sm:max-h-[70vh]">
          <ApiMutation
            mutationFn={createSysAdminUser}
            data={{}}
            loadingMessage="Creating administrator account..."
            mode="component"
            onSuccess={() => {
              onOpenChange(false);
              resetForm();
            }}
          >
            {({ onSubmit, isLoading, error }) => (
              <>
                <div className="space-y-6 py-4">
                  {searchError && (
                    <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-2 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{searchError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="userSearch"
                      className="flex items-center gap-2"
                    >
                      Search for Existing User
                      <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs">
                        (Required)
                      </span>
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="userSearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                        placeholder="Search by name or email"
                        disabled={!!selectedUser}
                      />
                      <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />

                      {selectedUser && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1/2 right-2 -translate-y-1/2"
                          onClick={() => {
                            setSelectedUser(null);
                            setFormData((prev) => ({
                              ...prev,
                              name: "",
                              email: "",
                            }));
                          }}
                          type="button"
                        >
                          Clear
                        </Button>
                      )}
                    </div>

                    {searchResults.length > 0 && !selectedUser && (
                      <div className="mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-md">
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            className="w-full cursor-pointer px-4 py-2 text-left hover:bg-gray-100"
                            onClick={() => selectUser(user)}
                            type="button"
                          >
                            <div className="flex items-center gap-2">
                              <User className="text-muted-foreground h-4 w-4" />
                              <span>{user.person?.name}</span>
                            </div>
                            {user.person?.email && (
                              <p className="text-muted-foreground text-xs">
                                {user.person.email}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedUser && (
                    <div className="bg-muted/30 rounded-md border p-3">
                      <h3 className="text-sm font-medium">Selected User</h3>
                      <div className="mt-1 text-sm">
                        <p>
                          <strong>Name:</strong> {selectedUser.person?.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedUser.person?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {!selectedUser && (
                    <div className="my-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                      <h4 className="flex items-center text-sm font-medium text-yellow-800">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Select a User First
                      </h4>
                      <p className="mt-1 text-xs text-yellow-700">
                        You must search for and select an existing user before
                        you can assign an administrator role.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="pt-2 text-right">Organizations</Label>
                    <div className="col-span-3 space-y-2">
                      {organizations.map((org) => (
                        <div key={org} className="flex items-center gap-2">
                          <Checkbox
                            id={`org-${org}`}
                            checked={formData.assignedOrganizations.includes(
                              org,
                            )}
                            onCheckedChange={(checked) =>
                              handleOrganizationToggle(org, !!checked)
                            }
                          />
                          <Label
                            htmlFor={`org-${org}`}
                            className="text-sm font-normal"
                          >
                            {org}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="pt-2 text-right">Lectorates</Label>
                    <div className="col-span-3 space-y-2">
                      {lectorates.map((lect) => (
                        <div key={lect} className="flex items-center gap-2">
                          <Checkbox
                            id={`lect-${lect}`}
                            checked={formData.assignedLectorates.includes(lect)}
                            onCheckedChange={(checked) =>
                              handleLectorateToggle(lect, !!checked)
                            }
                          />
                          <Label
                            htmlFor={`lect-${lect}`}
                            className="text-sm font-normal"
                          >
                            {lect}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive mb-4 flex items-center gap-2 rounded-md p-2 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error.message}</span>
                  </div>
                )}

                <DialogFooter className="flex gap-3 border-t border-gray-100 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="transition-all duration-200 hover:scale-105 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading || !selectedUser}
                    className="bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? "Creating..." : "Create Admin User"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </ApiMutation>
        </div>
      </DialogContent>
    </Dialog>
  );
}
