/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { JSX } from "react";
import {
  OrganisationDTO,
  OrganisationRoleType,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import Organisation from "@/components/organisation.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

export interface ProjectOrganisationsProps {
  editMode: boolean;
  selectedLeadOrgId?: string;
  setSelectedLeadOrgId?: (id: string | undefined) => void;
  organisations: OrganisationDTO[];
  handleEditOrg?: () => void;
}

export default function ProjectOrganisations({
  editMode,
  selectedLeadOrgId,
  setSelectedLeadOrgId,
  organisations,
  handleEditOrg,
}: Readonly<ProjectOrganisationsProps>): JSX.Element {
  const formatRoleType = (roleType: string): string => {
    return roleType.replace(/([A-Z])/g, " $1").trim();
  };

  const now = new Date();
  const projectLeadOrganisation = organisations.find((o) =>
    o.roles.some(
      (r) =>
        r.role === OrganisationRoleType.LeadResearchOrganization &&
        r.start_date <= now &&
        (r.end_date === undefined || r.end_date > now),
    ),
  );

  const otherOrganisations = organisations.filter(
    (o) => o.name !== projectLeadOrganisation?.name,
  );

  return (
    <>
      {editMode ? (
        <>
          <div>
            <Label htmlFor="lead-organization" className="font-semibold">
              Lead Organisation
            </Label>
            <Select
              value={selectedLeadOrgId ?? ""}
              onValueChange={setSelectedLeadOrgId}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select lead organization" />
              </SelectTrigger>
              <SelectContent>
                {organisations.map((org) => (
                  <SelectItem key={org.id} value={org.id ?? ""}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Label className="mb-2 font-semibold">Organisations</Label>
          <ul className="ml-1 space-y-4">
            {Object.values(OrganisationRoleType).map((roleType) => {
              const orgsWithRole = otherOrganisations.filter((org) =>
                org.roles.some((r) => r.role === roleType),
              );
              if (orgsWithRole.length === 0) return null;
              return (
                <li key={roleType}>
                  <h4 className="border-b">{formatRoleType(roleType)}</h4>
                  <ul className="mt-1 space-y-2">
                    {orgsWithRole.map((org) => (
                      <li key={org.id}>
                        <Organisation
                          org={org}
                          handleEditOrg={() => handleEditOrg}
                          roleType={roleType}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <div>
            <Label className="font-semibold">Lead Organisation</Label>
            <p className="mt-2 mb-6 text-gray-700">
              {organisations.length > 0 ? organisations[0].name : "N/A"}
            </p>
          </div>
          <Label className="mb-2 font-semibold">Organisations</Label>
          {otherOrganisations.length > 0 && (
            <ul className="ml-1 space-y-4">
              {Object.values(OrganisationRoleType).map((roleType) => {
                const orgsWithRole = otherOrganisations.filter((org) =>
                  org.roles.some((r) => r.role === roleType),
                );
                if (orgsWithRole.length === 0) return null;
                return (
                  <li key={roleType}>
                    <h4 className="border-b">{formatRoleType(roleType)}</h4>
                    <ul className="mt-1 space-y-2">
                      {orgsWithRole.map((org) => (
                        <li key={org.id}>
                          <Organisation
                            org={org}
                            handleEditOrg={() => handleEditOrg}
                            roleType={roleType}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </>
  );
}
