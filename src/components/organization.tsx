/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button";
import RorIcon from "@/components/icons/rorIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil } from "lucide-react";
import {
  ProjectOrganisationResponseDTO,
  OrganisationRoleType,
} from "@team-golfslag/conflux-api-client/src/client";
import { JSX } from "react";

export interface OrganizationProps {
  org: ProjectOrganisationResponseDTO;
  roleType: OrganisationRoleType;
  editMode: boolean;
  onEditClick: () => void;
}

const Organization = ({
  org,
  editMode,
  onEditClick,
}: OrganizationProps): JSX.Element => {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center gap-1 text-gray-700">
          {org.organisation.name}
          {org.organisation.ror_id && !editMode && (
            <Button
              className="h-auto has-[>svg]:p-1 [&_svg:not([class*='size-'])]:size-5"
              variant="ghost"
              size="sm"
              asChild
            >
              <a
                href={org.organisation.ror_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RorIcon></RorIcon>
              </a>
            </Button>
          )}
        </div>
        {editMode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={onEditClick}
                  aria-label="Edit organization"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit organization</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </>
  );
};

export default Organization;
