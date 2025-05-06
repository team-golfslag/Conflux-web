/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { ContributorRoleType } from "@team-golfslag/conflux-api-client/src/client";

/**
 * Formats a contributor role name from camelCase to a more readable format
 * @param role The ContributorRoleType to format
 * @returns A formatted string with spaces between words
 */
export const formatRoleName = (role: ContributorRoleType): string => {
  // Add space before uppercase letters (except the first letter)
  return (
    role
      .replace(/([A-Z])/g, " $1")
      // Special case for "ORCID"
      .replace(/Or Ci D/g, "ORCID")
      // Handle cases like "WritingOriginalDraft" -> "Writing Original Draft"
      .trim()
  );
};

/**
 * Formats a contributor role name to be displayed with a tooltip
 *
 * @param role The ContributorRoleType to format
 * @returns An object with short and long format for display
 */
export const getRoleDisplay = (
  role: ContributorRoleType,
): { short: string; long: string } => {
  const formatted = formatRoleName(role);

  // Map of roles to their descriptions
  const descriptions: Record<ContributorRoleType, string> = {
    [ContributorRoleType.Conceptualization]:
      "Ideas, formulation of research goals and aims",
    [ContributorRoleType.DataCuration]:
      "Management of research data and metadata",
    [ContributorRoleType.FormalAnalysis]:
      "Application of statistical or mathematical techniques",
    [ContributorRoleType.FundingAcquisition]:
      "Acquisition of financial support",
    [ContributorRoleType.Investigation]:
      "Conducting the research and investigation process",
    [ContributorRoleType.Methodology]: "Development or design of methodology",
    [ContributorRoleType.ProjectAdministration]:
      "Management and coordination responsibility",
    [ContributorRoleType.Resources]:
      "Provision of materials, equipment, or other resources",
    [ContributorRoleType.Software]:
      "Programming, software development, and implementation",
    [ContributorRoleType.Supervision]:
      "Oversight and leadership responsibility",
    [ContributorRoleType.Validation]: "Verification of results and experiments",
    [ContributorRoleType.Visualization]:
      "Preparation of visual data presentation",
    [ContributorRoleType.WritingOriginalDraft]: "Creation of the initial draft",
    [ContributorRoleType.WritingReviewEditing]:
      "Critical review and commentary",
  };

  return {
    short: formatted,
    long: descriptions[role] || formatted,
  };
};

export default formatRoleName;
