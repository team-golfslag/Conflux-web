/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * Formats an ORCID identifier as a URL.
 * @param orcidId The ORCID identifier (e.g., "0000-0000-0000-0000")
 * @returns The ORCID URL (e.g., "https://orcid.org/0000-0000-0000-0000")
 */
export const formatOrcidAsUrl = (
  orcidId: string | null | undefined,
): string | null => {
  if (!orcidId) return null;

  // If already a URL, return as is
  if (orcidId.startsWith("http")) return orcidId;

  // Clean up any formatting issues
  const cleanId = orcidId.replace(/\s/g, "");

  // Return as URL
  return `https://orcid.org/${cleanId}`;
};

/**
 * Extracts an ORCID identifier from a URL.
 * @param orcidUrl The ORCID URL (e.g., "https://orcid.org/0000-0000-0000-0000")
 * @returns The ORCID identifier (e.g., "0000-0000-0000-0000")
 */
export const extractOrcidFromUrl = (
  orcidUrl: string | null | undefined,
): string | null => {
  if (!orcidUrl) return null;

  // If not a URL, return as is
  if (!orcidUrl.startsWith("http")) return orcidUrl;

  // Extract ID from URL
  const match = orcidUrl.match(
    /(\d{4}-\d{4}-\d{4}-\d{4}|\d{4}-\d{4}-\d{4}-\d{3}X)/,
  );
  return match ? match[0] : null;
};
