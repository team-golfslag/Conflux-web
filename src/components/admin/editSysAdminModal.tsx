/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, GraduationCap, UserCog } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ApiMutation } from "@/components/apiMutation";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { UserResponseDTO } from "@team-golfslag/conflux-api-client/src/client";

interface EditSysAdminModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: UserResponseDTO | null;
  onUserUpdated?: () => void;
}

interface AdminFormData {
  assignedOrganizations: string[];
  assignedLectorates: string[];
}

export default function EditSysAdminModal({
  isOpen,
  onOpenChange,
  user,
  onUserUpdated,
}: EditSysAdminModalProps) {
  const [formData, setFormData] = useState<AdminFormData>({
    assignedOrganizations: [],
    assignedLectorates: [],
  });

  const [organizations, setOrganizations] = useState<string[]>([]);
  const [lectorates, setLectorates] = useState<string[]>([]);
  const apiClient = useContext(ApiClientContext);

  // Load organizations and lectorates
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgs, lects] = await Promise.all([
          apiClient.admin_GetOrganisations(),
          apiClient.admin_GetLectorates(),
        ]);
        setOrganizations(orgs);
        setLectorates(lects);
      } catch (error) {
        console.error("Failed to load organizations and lectorates:", error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, apiClient]);

  // Load user data when a user is provided
  useEffect(() => {
    if (user) {
      setFormData({
        assignedOrganizations: user.assigned_organisations || [],
        assignedLectorates: user.assigned_lectorates || [],
      });
    }
  }, [user]);

  const handleOrganizationToggle = (orgName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedOrganizations: checked
        ? [...prev.assignedOrganizations, orgName]
        : prev.assignedOrganizations.filter((org) => org !== orgName),
    }));
  };

  const handleLectorateToggle = (lectName: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      assignedLectorates: checked
        ? [...prev.assignedLectorates, lectName]
        : prev.assignedLectorates.filter((name) => name !== lectName),
    }));
  };

  const updateSysAdminUser = async () => {
    if (!user) {
      throw new Error("No user provided for editing");
    }

    // Note: The backend API doesn't have a direct "updateSysAdminUser" method
    // Instead, we need to use the assignment methods

    // Update organization assignments
    await apiClient.admin_AssignOrganisationsToUser(
      formData.assignedOrganizations,
      user.id,
    );

    // Update lectorate assignments
    await apiClient.admin_AssignLectoratesToUser(
      formData.assignedLectorates,
      user.id,
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-0 bg-white/95 shadow-2xl backdrop-blur-md">
        <DialogHeader className="space-y-3 border-b border-gray-100 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-lg bg-blue-100 p-2">
              <UserCog className="h-6 w-6 text-gray-600" />
            </div>
            Edit System Administrator
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Select the organizations and lectorates this administrator can
            manage. These permissions will determine their access scope.
          </DialogDescription>
        </DialogHeader>

        <ApiMutation
          mutationFn={updateSysAdminUser}
          data={{}}
          loadingMessage="Updating administrator account..."
          mode="component"
          onSuccess={() => {
            onUserUpdated?.();
            onOpenChange(false);
          }}
        >
          {({ isLoading, onSubmit }) => (
            <>
              <div className="mt-6 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Organizations */}
                  <Card className="border-0 bg-white shadow-md">
                    <CardHeader className="border-b border-gray-100/50 bg-gray-50">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="rounded-lg bg-blue-100 p-1.5">
                          <Building2 className="h-4 w-4 text-gray-600" />
                        </div>
                        Organizations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-60 overflow-y-auto">
                      {organizations.map((org) => (
                        <div
                          key={org}
                          className="flex items-center space-x-3 rounded-lg transition-colors duration-200 hover:bg-blue-50/50"
                        >
                          <Checkbox
                            id={`org-${org}`}
                            checked={formData.assignedOrganizations.includes(
                              org,
                            )}
                            onCheckedChange={(checked: boolean) =>
                              handleOrganizationToggle(org, checked)
                            }
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <Label
                            htmlFor={`org-${org}`}
                            className="cursor-pointer text-sm font-medium text-gray-700"
                          >
                            {org}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Lectorates */}
                  <Card className="border-0 bg-white shadow-md">
                    <CardHeader className="border-b border-gray-100/50 bg-gray-50">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="rounded-lg bg-green-100 p-1.5">
                          <GraduationCap className="h-4 w-4 text-green-600" />
                        </div>
                        Lectorates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-60 overflow-y-auto">
                      {lectorates.map((lectorate) => (
                        <div
                          key={lectorate}
                          className="flex items-center space-x-3 rounded-lg transition-colors duration-200 hover:bg-green-50/50"
                        >
                          <Checkbox
                            id={`lect-${lectorate}`}
                            checked={formData.assignedLectorates.includes(
                              lectorate,
                            )}
                            onCheckedChange={(checked: boolean) =>
                              handleLectorateToggle(lectorate, checked)
                            }
                            className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                          />
                          <Label
                            htmlFor={`lect-${lectorate}`}
                            className="cursor-pointer text-sm font-medium text-gray-700"
                          >
                            {lectorate}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={() => onSubmit()} disabled={isLoading}>
                  Update Administrator
                </Button>
              </div>
            </>
          )}
        </ApiMutation>
      </DialogContent>
    </Dialog>
  );
}
