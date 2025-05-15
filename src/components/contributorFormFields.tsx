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

export interface ContributorFormData {
  name: string;
  email: string;
  orcidId: string;
  roles: ContributorRoleType[];
  positions: ContributorPositionType[];
  leader: boolean;
  contact: boolean;
}

interface ContributorFormFieldsProps {
  formData: ContributorFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (role: ContributorRoleType) => void;
  handlePositionChange: (position: ContributorPositionType) => void;
  setFormData: React.Dispatch<React.SetStateAction<ContributorFormData>>;
  isEdit?: boolean;
}

export default function ContributorFormFields({
  formData,
  handleInputChange,
  handleRoleChange,
  handlePositionChange,
  setFormData,
  isEdit = false,
}: Readonly<ContributorFormFieldsProps>) {
  const idPrefix = isEdit ? "edit-" : "";
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}name`} className="text-right">
          Name
        </Label>
        <Input
          id={`${idPrefix}name`}
          name="name"
          className="col-span-3"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

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
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={`${idPrefix}orcidId`} className="text-right">
          ORCID ID
        </Label>
        <Input
          id={`${idPrefix}orcidId`}
          name="orcidId"
          className="col-span-3"
          value={formData.orcidId}
          onChange={handleInputChange}
          placeholder="0000-0000-0000-0000"
        />
      </div>

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
                      onClick={() => handlePositionChange(position)}
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
                      onClick={() => handleRoleChange(role)}
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
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, leader: checked }))
            }
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
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, contact: checked }))
            }
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
