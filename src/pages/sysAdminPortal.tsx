/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, UserPlus } from "lucide-react";
import SysAdminUsersList from "@/components/admin/sysAdminUsersList";
import AddSysAdminModal from "@/components/admin/addSysAdminModal";
import { useSession } from "@/hooks/SessionContext";
import { PermissionLevel } from "@team-golfslag/conflux-api-client/src/client";

export default function SysAdminPortal() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const session = useSession();

  const permissionLevel = session?.session?.user?.permission_level;

  const handleUserAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Check if user has admin access
  if (permissionLevel !== PermissionLevel.SuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. You do not have system administrator privileges.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-scree pb-12">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            System Administration
          </h1>
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsAddUserModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin User
            </Button>
          </div>
        </div>
        <SysAdminUsersList refreshTrigger={refreshTrigger} />
        <AddSysAdminModal
          isOpen={isAddUserModalOpen}
          onOpenChange={setIsAddUserModalOpen}
          onUserAdded={handleUserAdded}
        />
      </div>
    </div>
  );
}
