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
  let description: string;

  // Use switch case instead of a large record
  switch (role) {
    case ContributorRoleType.Conceptualization:
      description = "Ideas, formulation of research goals and aims";
      break;
    case ContributorRoleType.DataCuration:
      description = "Management of research data and metadata";
      break;
    case ContributorRoleType.FormalAnalysis:
      description = "Application of statistical or mathematical techniques";
      break;
    case ContributorRoleType.FundingAcquisition:
      description = "Acquisition of financial support";
      break;
    case ContributorRoleType.Investigation:
      description = "Conducting the research and investigation process";
      break;
    case ContributorRoleType.Methodology:
      description = "Development or design of methodology";
      break;
    case ContributorRoleType.ProjectAdministration:
      description = "Management and coordination responsibility";
      break;
    case ContributorRoleType.Resources:
      description = "Provision of materials, equipment, or other resources";
      break;
    case ContributorRoleType.Software:
      description = "Programming, software development, and implementation";
      break;
    case ContributorRoleType.Supervision:
      description = "Oversight and leadership responsibility";
      break;
    case ContributorRoleType.Validation:
      description = "Verification of results and experiments";
      break;
    case ContributorRoleType.Visualization:
      description = "Preparation of visual data presentation";
      break;
    case ContributorRoleType.WritingOriginalDraft:
      description = "Creation of the initial draft";
      break;
    case ContributorRoleType.WritingReviewEditing:
      description = "Critical review and commentary";
      break;
    default:
      description = formatted;
  }

  return {
    short: formatted,
    long: description,
  };
};

export default formatRoleName;
