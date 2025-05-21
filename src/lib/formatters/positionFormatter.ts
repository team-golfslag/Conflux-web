/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { ContributorPositionType } from "@team-golfslag/conflux-api-client/src/client";

/**
 * Formats a contributor position name from camelCase to a more readable format
 * @param position The ContributorPositionType to format
 * @returns A formatted string with spaces between words
 */
export const formatPositionName = (
  position: ContributorPositionType,
): string => {
  // Add space before uppercase letters (except the first letter)
  return (
    position
      .replace(/([A-Z])/g, " $1")
      // Handle cases like "Co-Investigator" -> "Co Investigator"
      .trim()
  );
};

/**
 * Formats a contributor position name to be displayed with a tooltip
 *
 * @param position The ContributorPositionType to format
 * @returns An object with short and long format for display
 */
export const getPositionDisplay = (
  position: ContributorPositionType,
): { short: string; long: string } => {
  const formatted = formatPositionName(position);
  let description: string;

  // Use switch case for descriptions
  switch (position) {
    case ContributorPositionType.PrincipalInvestigator:
      description =
        "Lead researcher responsible for the preparation, conduct, and administration of the project";
      break;
    case ContributorPositionType.CoInvestigator:
      description =
        "Researcher contributing significantly to the project, working with the Principal Investigator";
      break;
    case ContributorPositionType.Partner:
      description =
        "Individual or organization collaborating on the project with shared responsibilities";
      break;
    case ContributorPositionType.Consultant:
      description =
        "Expert providing specialized advice or services to the project";
      break;
    case ContributorPositionType.Other:
      description =
        "Other position types not fitting into the standard categories";
      break;
    default:
      description = formatted;
  }

  return {
    short: formatted,
    long: description,
  };
};

export default formatPositionName;
