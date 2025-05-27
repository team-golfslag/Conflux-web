/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import {
  ContributorRoleType,
  ContributorPositionType,
} from "@team-golfslag/conflux-api-client/src/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRoleDisplay } from "@/lib/formatters/roleFormatter";
import { getPositionDisplay } from "@/lib/formatters/positionFormatter";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export interface ContributorFormData {
  name?: string;
  email?: string;
  orcidId?: string;
  roles: ContributorRoleType[];
  positions: ContributorPositionType[];
  leader: boolean;
  contact: boolean;
}

interface ContributorFormFieldsProps {
  formData: ContributorFormData;
  onNameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrcidIdChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (role: ContributorRoleType) => void;
  onPositionChange: (position: ContributorPositionType) => void;
  onLeaderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrcidAutoFill?: () => Promise<boolean>;
  orcidError?: string | null;
  isEdit?: boolean;
}

export default function ContributorFormFields({
  formData,
  onNameChange,
  onEmailChange,
  onOrcidIdChange,
  onRoleChange,
  onPositionChange,
  onLeaderChange,
  onContactChange,
  onOrcidAutoFill,
  orcidError,
  isEdit = false,
}: Readonly<ContributorFormFieldsProps>) {
  const idPrefix = isEdit ? "edit-" : "";
  return (
    <div className="grid gap-4 py-4">
      {onNameChange && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${idPrefix}name`} className="text-right">
            Name
          </Label>
          <Input
            id={`${idPrefix}name`}
            name="name"
            className="col-span-3"
            value={formData.name}
            onChange={onNameChange}
          />
        </div>
      )}

      {onEmailChange && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${idPrefix}email`} className="text-right">
            Email
          </Label>
          <Input
            id={`${idPrefix}email`}
            name="email"
            type="email"
            className="col-span-3"
            value={formData.email}
            onChange={onEmailChange}
          />
        </div>
      )}

      {onOrcidIdChange && onOrcidAutoFill && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor={`${idPrefix}orcidId`} className="text-right">
            ORCID ID
          </Label>
          <div className="col-span-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Input
                id={`${idPrefix}orcidId`}
                name="orcidId"
                className={`flex-1 ${orcidError ? "border-red-500" : ""}`}
                value={formData.orcidId}
                onChange={onOrcidIdChange}
                placeholder="0000-0000-0000-0000"
                aria-invalid={!!orcidError}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onOrcidAutoFill}
                      disabled={!formData.orcidId || !onOrcidAutoFill}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Autofill details from ORCID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {orcidError && (
              <div className="text-sm text-red-500">{orcidError}</div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="pt-2 text-right">Positions</Label>
        <div className="col-span-3 flex flex-wrap gap-2">
          {Object.values(ContributorPositionType).map((position) => {
            const positionDisplay = getPositionDisplay(position);
            return (
              <TooltipProvider key={position}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      key={position}
                      variant={
                        formData.positions.includes(position)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => onPositionChange(position)}
                    >
                      {positionDisplay.short}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{positionDisplay.long}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="pt-2 text-right">Roles</Label>
        <div className="col-span-3 flex flex-wrap gap-2">
          {Object.values(ContributorRoleType).map((role) => {
            const roleDisplay = getRoleDisplay(role);
            return (
              <TooltipProvider key={role}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      key={role}
                      variant={
                        formData.roles.includes(role) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => onRoleChange(role)}
                    >
                      {roleDisplay.short}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{roleDisplay.long}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}leader`} className="text-right">
          Leader
        </Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Switch
            id={`${idPrefix}leader`}
            checked={formData.leader}
            onCheckedChange={(checked) => {
              const event = {
                target: { checked },
              } as React.ChangeEvent<HTMLInputElement>;
              onLeaderChange(event);
            }}
          />
          <Label
            htmlFor={`${idPrefix}leader`}
            className="text-muted-foreground text-sm"
          >
            Mark as project leader
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}contact`} className="text-right">
          Contact
        </Label>
        <div className="col-span-3 flex items-center space-x-2">
          <Switch
            id={`${idPrefix}contact`}
            checked={formData.contact}
            onCheckedChange={(checked) => {
              const event = {
                target: { checked },
              } as React.ChangeEvent<HTMLInputElement>;
              onContactChange(event);
            }}
          />
          <Label
            htmlFor={`${idPrefix}contact`}
            className="text-muted-foreground text-sm"
          >
            Mark as contact person
          </Label>
        </div>
      </div>
    </div>
  );
}
