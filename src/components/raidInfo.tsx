/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LoadingWrapper } from "@/components/loadingWrapper";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiMutation } from "@/components/apiMutation";
import { format } from "date-fns";
import {
  ExternalLink,
  Calendar,
  FileText,
  Shield,
  Hash,
  Building,
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  RAiDIncompatibilityType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import RaidIcon from "./icons/raidIcon";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { useContext } from "react";

type RAiDInfoProps = {
  projectId: string;
  project?: ProjectResponseDTO;
  isAdmin?: boolean;
  onProjectUpdate?: () => void;
};

/**
 * RAiD Info component that displays research metadata information
 * @param projectId the project ID to fetch RAiD info for
 * @param project the project data for enhanced incompatibility display
 * @param isAdmin whether the current user is an admin
 * @param onProjectUpdate callback to update project data after minting
 */
export default function RAiDInfo({
  projectId,
  project,
  isAdmin = false,
  onProjectUpdate,
}: Readonly<RAiDInfoProps>) {
  // Create a dependency that changes when project data that affects RAiD changes
  const projectDataHash = project
    ? JSON.stringify({
        titles: project.titles,
        descriptions: project.descriptions,
        contributors: project.contributors,
        products: project.products,
      })
    : null;

  // Add API client hook
  const apiClient = useContext(ApiClientContext);

  // Add sync state management
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncFailed, setSyncFailed] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Method to sync RAiD data with external service
  const syncRaidData = async () => {
    if (!raidInfo?.r_ai_d_id) return;

    try {
      setIsSyncing(true);
      setSyncSuccess(false);
      setSyncFailed(false);

      // Call the sync API - the returned data will be fetched via the refresh trigger
      await apiClient.raidInfo_SyncRaid(projectId);

      // Trigger a refresh of the RAiD data by updating the refresh counter
      setRefreshTrigger((prev) => prev + 1);

      // Also trigger project update if available (in case project data changed)
      onProjectUpdate?.();

      setSyncSuccess(true);
      // Reset success state after 2 seconds
      setTimeout(() => {
        setSyncSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error syncing RAiD data:", error);
      setSyncFailed(true);
      // Reset failure state after 2 seconds
      setTimeout(() => {
        setSyncFailed(false);
      }, 2000);
    } finally {
      setIsSyncing(false);
    }
  };

  const {
    data: raidInfo,
    isLoading,
    error,
  } = useApiQuery(
    (client) => client.raidInfo_GetRaidInfoByProjectId(projectId),
    [projectId, projectDataHash, refreshTrigger],
  );

  const { data: incompatibilities, isLoading: incompatibilitiesLoading } =
    useApiQuery(
      (client) => client.raidInfo_GetRaidIncompatibilities(projectId),
      [projectId, projectDataHash, refreshTrigger],
    );

  // Helper function to format incompatibility type to readable text
  const formatIncompatibilityType = (type: RAiDIncompatibilityType): string => {
    switch (type) {
      case RAiDIncompatibilityType.NoActivePrimaryTitle:
        return "No active primary title";
      case RAiDIncompatibilityType.MultipleActivePrimaryTitle:
        return "Multiple active primary titles";
      case RAiDIncompatibilityType.ProjectTitleTooLong:
        return "Project title too long";
      case RAiDIncompatibilityType.NoPrimaryDescription:
        return "No primary description";
      case RAiDIncompatibilityType.MultiplePrimaryDescriptions:
        return "Multiple primary descriptions";
      case RAiDIncompatibilityType.ProjectDescriptionTooLong:
        return "Project description too long";
      case RAiDIncompatibilityType.NoContributors:
        return "No contributors";
      case RAiDIncompatibilityType.ContributorWithoutOrcid:
        return "Contributor without ORCID";
      case RAiDIncompatibilityType.OverlappingContributorPositions:
        return "Overlapping contributor positions";
      case RAiDIncompatibilityType.NoProjectLeader:
        return "No project lead";
      case RAiDIncompatibilityType.NoProjectContact:
        return "No project contact";
      case RAiDIncompatibilityType.OverlappingOrganisationRoles:
        return "Overlapping organisation roles";
      case RAiDIncompatibilityType.NoLeadResearchOrganisation:
        return "No lead research organisation";
      case RAiDIncompatibilityType.MultipleLeadResearchOrganisation:
        return "Multiple lead research organisations";
      case RAiDIncompatibilityType.NoProductCategory:
        return "No product category";
      case RAiDIncompatibilityType.OrganisationWithoutRor:
        return "Organisation without ROR ID";
      default:
        return String(type);
    }
  };

  // Helper function to get enhanced incompatibility information
  const getEnhancedIncompatibilityInfo = (incompatibility: {
    type: RAiDIncompatibilityType;
    object_id: string;
  }) => {
    if (!project || !incompatibility.object_id) {
      return null;
    }

    const objectId = incompatibility.object_id;

    // Handle description-related incompatibilities
    if (
      incompatibility.type === RAiDIncompatibilityType.NoPrimaryDescription ||
      incompatibility.type ===
        RAiDIncompatibilityType.MultiplePrimaryDescriptions ||
      incompatibility.type === RAiDIncompatibilityType.ProjectDescriptionTooLong
    ) {
      const description = project.descriptions?.find(
        (desc) => desc.id === objectId,
      );
      if (description) {
        return {
          text:
            description.text?.substring(0, 100) +
            (description.text?.length > 100 ? "..." : ""),
          type: description.type,
          language: description.language?.id || "default",
        };
      }
    }

    // Handle title-related incompatibilities
    if (
      incompatibility.type === RAiDIncompatibilityType.NoActivePrimaryTitle ||
      incompatibility.type ===
        RAiDIncompatibilityType.MultipleActivePrimaryTitle ||
      incompatibility.type === RAiDIncompatibilityType.ProjectTitleTooLong
    ) {
      const title = project.titles?.find((title) => title.id === objectId);
      if (title) {
        return {
          text:
            title.text?.substring(0, 100) +
            (title.text?.length > 100 ? "..." : ""),
          type: title.type,
          language: title.language?.id || "default",
        };
      }
    }

    // Handle contributor-related incompatibilities
    if (
      incompatibility.type ===
        RAiDIncompatibilityType.ContributorWithoutOrcid ||
      incompatibility.type === RAiDIncompatibilityType.NoProjectLeader ||
      incompatibility.type === RAiDIncompatibilityType.NoProjectContact
    ) {
      const contributor = project.contributors?.find(
        (contrib) => contrib.person.id === objectId,
      );
      if (contributor) {
        return {
          name: contributor.person.name,
          email: contributor.person.email,
          orcid: contributor.person.orcid_id,
          isLeader: contributor.leader,
          isContact: contributor.contact,
        };
      }
    }
    // Handle all product-related incompatibilities
    if (incompatibility.type === RAiDIncompatibilityType.NoProductCategory) {
      const product = project.products?.find((prod) => prod.id === objectId);
      if (product) {
        return {
          text: product.title,
          type: product.type,
        };
      }
    }

    // Handle organisation-related incompatibilities
    if (
      incompatibility.type === RAiDIncompatibilityType.OrganisationWithoutRor ||
      incompatibility.type ===
        RAiDIncompatibilityType.OverlappingOrganisationRoles ||
      incompatibility.type ===
        RAiDIncompatibilityType.NoLeadResearchOrganisation ||
      incompatibility.type ===
        RAiDIncompatibilityType.MultipleLeadResearchOrganisation
    ) {
      const organisation = project.organisations?.find(
        (org) => org.organisation.id === objectId,
      )?.organisation;
      if (organisation) {
        return {
          text: organisation.name,
          ror: organisation.ror_id,
        };
      }
    }

    return null;
  };

  // Helper function to render enhanced incompatibility item
  const renderIncompatibilityItem = (
    incompatibility: { type: RAiDIncompatibilityType; object_id: string },
    index: number,
  ) => {
    const enhancedInfo = getEnhancedIncompatibilityInfo(incompatibility);

    return (
      <div
        key={index}
        className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-3"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <div className="flex-1 text-sm">
          <p className="font-medium text-amber-800">
            {formatIncompatibilityType(incompatibility.type)}
          </p>

          {enhancedInfo ? (
            <div className="mt-2 space-y-1">
              {/* Description or Title content */}
              {enhancedInfo.text && (
                <div className="text-xs">
                  <span className="font-medium text-amber-700">
                    {enhancedInfo.language ? "Content" : "Title"}:
                  </span>
                  <p className="mt-1 rounded bg-amber-100 px-2 py-1 text-amber-600 italic">
                    "{enhancedInfo.text}"
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-amber-600">
                    {enhancedInfo.type && (
                      <span>
                        Type:{" "}
                        <span className="font-mono">{enhancedInfo.type}</span>
                      </span>
                    )}
                    {enhancedInfo.language && (
                      <>
                        <span className="text-amber-400">•</span>
                        <span>
                          Lang:{" "}
                          <span className="font-mono">
                            {enhancedInfo.language}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Contributor information */}
              {enhancedInfo.name && (
                <div className="text-xs">
                  <span className="font-medium text-amber-700">
                    Contributor:
                  </span>
                  <p className="mt-1 text-amber-600">
                    <span className="font-semibold">{enhancedInfo.name}</span>
                    {enhancedInfo.email && (
                      <span className="text-amber-500">
                        {" "}
                        ({enhancedInfo.email})
                      </span>
                    )}
                  </p>
                  <div className="mt-1 flex gap-2 text-amber-600">
                    {enhancedInfo.orcid && (
                      <span>
                        ORCID:{" "}
                        <span className="overflow-wrap-anywhere font-mono text-xs break-words break-all">
                          {enhancedInfo.orcid}
                        </span>
                      </span>
                    )}
                    {enhancedInfo.isLeader && (
                      <span className="rounded bg-amber-200 px-1 text-xs">
                        Leader
                      </span>
                    )}
                    {enhancedInfo.isContact && (
                      <span className="rounded bg-amber-200 px-1 text-xs">
                        Contact
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Fallback to object ID if no enhanced info
            incompatibility.object_id &&
            incompatibility.object_id !=
              "00000000-0000-0000-0000-000000000000" && (
              <p className="overflow-wrap-anywhere mt-1 font-mono text-xs break-words break-all text-amber-600">
                ID: {incompatibility.object_id}
              </p>
            )
          )}
        </div>
      </div>
    );
  };

  // If we have an error getting RAiD info, check if it's because the project hasn't been minted
  if (error && !raidInfo) {
    // Project hasn't been minted - show compatibility status
    return (
      <LoadingWrapper
        isLoading={incompatibilitiesLoading}
        isInitialLoad={incompatibilitiesLoading}
        loadingMessage="Checking RAiD compatibility..."
        error={null}
      >
        <Card className="border-gray-200 bg-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-amber-900">
              <AlertTriangle className="h-5 w-5" />
              RAiD Status
            </CardTitle>
            <Badge
              variant="outline"
              className="border-amber-200 bg-amber-100 text-amber-800"
            >
              Not Minted
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg border border-amber-100 bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm text-gray-600">
                This project has not been minted as a RAiD (Research Activity
                Identifier) yet.
              </p>

              {incompatibilities && incompatibilities.length > 0 ? (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <Label className="font-semibold text-gray-700">
                      Issues preventing RAiD minting ({incompatibilities.length}
                      )
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {incompatibilities.map((incompatibility, index) =>
                      renderIncompatibilityItem(incompatibility, index),
                    )}
                  </div>
                </div>
              ) : incompatibilities && incompatibilities.length === 0 ? (
                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <Label className="font-semibold text-green-700">
                        Ready for RAiD minting
                      </Label>
                      <p className="mt-1 text-sm text-green-600">
                        This project meets all requirements and can be minted as
                        a RAiD.
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <ApiMutation
                      mutationFn={(client, data: string) =>
                        client.raidInfo_MintRaid(data)
                      }
                      data={projectId}
                      onSuccess={() => {
                        // Update project data to reflect the minted RAiD
                        onProjectUpdate?.();
                      }}
                      onError={(error) => {
                        console.error("Failed to mint RAiD:", error);
                      }}
                    >
                      {({ isLoading, error, onSubmit }) => (
                        <div className="mt-3 border-t border-green-200 pt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={onSubmit}
                              disabled={isLoading}
                              className="bg-green-600 text-white hover:bg-green-700"
                              size="sm"
                            >
                              <Zap className="mr-1 h-4 w-4" />
                              {isLoading ? "Minting..." : "Mint RAiD"}
                            </Button>
                            <span className="text-xs text-green-600">
                              Admin only
                            </span>
                          </div>
                          {error && (
                            <p className="mt-2 text-xs text-red-600">
                              Error: {error.message || "Failed to mint RAiD"}
                            </p>
                          )}
                        </div>
                      )}
                    </ApiMutation>
                  )}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </LoadingWrapper>
    );
  }

  // Handle other errors normally
  if (error && error.status !== 404) {
    return (
      <LoadingWrapper
        isLoading={isLoading}
        isInitialLoad={isLoading}
        loadingMessage="Loading RAiD information..."
        error={error}
      >
        {null}
      </LoadingWrapper>
    );
  }

  return (
    <LoadingWrapper
      isLoading={isLoading}
      isInitialLoad={isLoading}
      loadingMessage="Loading RAiD information..."
      error={error}
    >
      {raidInfo && (
        <Card className="border-gray-200 bg-gray-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <RaidIcon width={48} height={48} className="text-blue-600" />
              Information
            </CardTitle>
            {raidInfo?.r_ai_d_id && (
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={syncRaidData}
                        disabled={isSyncing}
                        className="relative"
                      >
                        {syncSuccess ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <>
                            {syncFailed ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <RefreshCw
                                className={`h-4 w-4 transition-transform duration-300 ${isSyncing ? "animate-spin" : "hover:rotate-90"}`}
                              />
                            )}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isSyncing ? (
                          "Syncing RAiD data..."
                        ) : (
                          <>
                            {syncSuccess ? (
                              "Sync complete!"
                            ) : (
                              <>
                                {syncFailed
                                  ? "Sync failed!"
                                  : "Sync RAiD data with registry"}
                              </>
                            )}
                          </>
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Main RAiD ID */}
            <div className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-600" />
                  <Label className="font-semibold text-gray-700">RAiD ID</Label>
                </div>
                <a
                  href={raidInfo.r_ai_d_id}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
              <p className="overflow-wrap-anywhere mt-1 rounded bg-gray-100 px-2 py-1 font-mono text-sm break-words break-all text-gray-700">
                {raidInfo.r_ai_d_id}
              </p>
            </div>

            {/* Status and Sync Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Label className="font-semibold text-gray-700">
                      Last Sync
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    {raidInfo.latest_sync
                      ? format(
                          new Date(raidInfo.latest_sync),
                          "d MMMM yyyy 'at' HH:mm",
                        )
                      : "Never synced"}
                  </p>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <Label className="font-semibold text-gray-700">
                      Status
                    </Label>
                  </div>
                  <Badge
                    variant={raidInfo.dirty ? "destructive" : "default"}
                    className={
                      raidInfo.dirty
                        ? "bg-gray-200 text-gray-700"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {raidInfo.dirty ? "Needs Sync" : "Up to Date"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <Label className="font-semibold text-gray-700">
                      Version
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">v{raidInfo.version}</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <Label className="font-semibold text-gray-700">
                      License
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600">{raidInfo.license}</p>
                </div>
              </div>
            </div>

            {/* Registration Details */}
            <div className="border-t border-blue-100 pt-4">
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-700">
                <Building className="h-4 w-4" />
                Registration Details
              </h4>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <Label className="font-medium text-gray-600">
                    Registration Agency
                  </Label>
                  <p className="overflow-wrap-anywhere mt-1 rounded bg-gray-50 px-2 py-1 font-mono text-xs break-words break-all text-gray-800">
                    {raidInfo.registration_agency_id}
                  </p>
                </div>

                <div>
                  <Label className="font-medium text-gray-600">Owner ID</Label>
                  <p className="overflow-wrap-anywhere mt-1 rounded bg-gray-50 px-2 py-1 font-mono text-xs break-words break-all text-gray-800">
                    {raidInfo.owner_id}
                  </p>
                </div>

                {raidInfo.owner_service_point && (
                  <div className="md:col-span-2">
                    <Label className="font-medium text-gray-600">
                      Owner Service Point
                    </Label>
                    <p className="mt-1 text-gray-800">
                      {raidInfo.owner_service_point}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </LoadingWrapper>
  );
}
