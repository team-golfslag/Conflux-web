/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card } from "@/components/ui/card";
import {
  ContributorPositionType,
  ContributorRoleType,
  UserRole,
} from "@team-golfslag/conflux-api-client/src/client";
import { Check, Crown, Contact, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OrcidIcon from "@/components/icons/orcidIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRoleDisplay } from "@/lib/formatters/roleFormatter";
import { getPositionDisplay } from "@/lib/formatters/positionFormatter"; // Added import
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import { useState } from "react";

type ContributorCardProps = {
  id: string;
  name: string;
  email?: string | null;
  orcidId?: string | null;
  roles: ContributorRoleType[] | UserRole[];
  position?: ContributorPositionType;
  isLeader?: boolean;
  isContact?: boolean;
  isConfluxUser?: boolean;
  editMode: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  openDeleteDialog?: () => void;
};

export default function ContributorCard({
  name,
  email,
  orcidId,
  roles,
  position,
  isLeader,
  isContact,
  editMode,
  onEdit,
  onDelete,
  openDeleteDialog,
}: Readonly<ContributorCardProps>) {
  const [copied, setCopied] = useState(false);

  // Function to copy ORCID ID to clipboard
  const copyOrcidToClipboard = () => {
    if (!orcidId) return;
    navigator.clipboard.writeText(orcidId).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <Card className="flex h-full flex-col border border-gray-200 p-3 shadow-sm">
      <div className="flex h-full flex-col justify-between">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{name}</p>
              {isLeader && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Crown className="h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>Project Leader</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {isContact && (
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

            {orcidId && !editMode && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0"
                      onClick={copyOrcidToClipboard}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <OrcidIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? "Copied!" : "Click to copy ORCID"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {editMode && onEdit && onDelete && openDeleteDialog && (
              <div className="flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-blue-500 hover:text-blue-700"
                        onClick={onEdit}
                        aria-label="Edit contributor"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit contributor</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AlertDialog>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80 p-0"
                            onClick={openDeleteDialog}
                            aria-label="Delete contributor"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Delete contributor</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </AlertDialog>
              </div>
            )}
          </div>
          {email && <p className="text-muted-foreground text-xs">{email}</p>}
        </div>

        <div className="mt-auto flex flex-col gap-1 pt-3">
          {position && (
            <div className="flex flex-wrap justify-start gap-1">
              {(() => {
                const positionDisplay = getPositionDisplay(position);
                return (
                  <TooltipProvider key={positionDisplay.short}>
                    {" "}
                    {/* Using positionDisplay.short as key */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="h-5 px-2 py-0 text-xs"
                        >
                          {positionDisplay.short}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {positionDisplay.long}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })()}
            </div>
          )}
          {roles.length > 0 && (
            <div className="flex flex-wrap justify-start gap-1">
              {roles.map((role, index) => {
                if (typeof role === "string") {
                  // ContributorRoleType
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
                } else {
                  // Role (from user)
                  return (
                    <Badge
                      key={role.urn ?? `role-${index}`}
                      variant="secondary"
                      className="h-5 px-2 py-0 text-xs"
                    >
                      {role.type}
                    </Badge>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
