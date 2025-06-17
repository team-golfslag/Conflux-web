/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card } from "@/components/ui/card";
import ProjectOverview from "@/components/overview/projectOverview";
import ProjectContributors from "@/components/contributor/projectContributors";
import ProjectWorks from "@/components/product/projectProducts";
import { useParams } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import ProjectDetails from "@/components/projectDetails.tsx";
import ProjectTimeline from "@/components/projectTimeline.tsx";
import RAiDInfo from "@/components/raidInfo.tsx";
import PageLinks from "@/components/pageLinks";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { LoadingWrapper } from "@/components/loadingWrapper";
import {
  ProjectResponseDTO,
  SwaggerException,
  UserRoleType,
  ITimelineItemResponseDTO,
  PermissionLevel,
} from "@team-golfslag/conflux-api-client/src/client";
import { useSession } from "@/hooks/SessionContext";
import ProjectOrganizations from "@/components/organization/projectOrganizations";
import FundingView from "@/components/funding/fundingView";
import { useProjectCache } from "@/hooks/useProjectCache";

// Initially empty, will be populated from API

/** Project page component <br>
 * Uses the 'id' param from the react routing to get the correct page from the backend
 */
export default function ProjectPage() {
  const { id } = useParams();
  const session = useSession();
  const apiClient = useContext(ApiClientContext);
  const projectCache = useProjectCache();
  const [project, setProject] = useState<ProjectResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<SwaggerException | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timelineData, setTimelineData] = useState<ITimelineItemResponseDTO[]>(
    [],
  );

  const overviewRef = useRef<HTMLDivElement>(null);
  const contributorsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Function to fetch the project data
  const fetchProject = async () => {
    if (!id) return;

    // Check if we have cached data first
    const cachedProject = projectCache.consumeCachedProject(id);
    if (cachedProject && !cachedProject.isLoading) {
      // Use cached data immediately
      setProject(cachedProject.data);
      if (cachedProject.timeline) {
        setTimelineData(cachedProject.timeline);
      }

      // Set admin status based on cached data
      const admin = cachedProject.data.users
        .find((user) => user.scim_id === session?.session?.user?.scim_id)
        ?.roles.map((role) => role.type)
        .includes(UserRoleType.Admin);
      setIsAdmin(admin || false);

      if (
        session?.session?.user?.permission_level === PermissionLevel.SuperAdmin
      ) {
        setIsAdmin(true);
      }

      if (
        session?.session?.user?.permission_level === PermissionLevel.SystemAdmin
      ) {
        const userOrganizations =
          session.session.user.assigned_organisations || [];
        if (
          cachedProject.data.owner_organisation &&
          userOrganizations.includes(cachedProject.data.owner_organisation)
        ) {
          setIsAdmin(true);
        }

        const userLectorates = session.session.user.assigned_lectorates || [];
        if (
          cachedProject.data.lectorate &&
          userLectorates.includes(cachedProject.data.lectorate)
        ) {
          setIsAdmin(true);
        }
      }

      // Don't show loading since we have cached data
      setIsLoading(false);
      setIsInitialLoad(false);
      setError(null);

      // If we don't have timeline data, fetch it in the background
      if (!cachedProject.timeline) {
        try {
          const timeline = await apiClient.projects_GetProjectTimeline(id);
          setTimelineData(timeline);
        } catch (err) {
          console.error("Error fetching timeline:", err);
        }
      }

      return; // Exit early since we used cached data
    }

    setIsLoading(true);
    try {
      // Fetch project details
      const data = await apiClient.projects_GetProjectById(id);
      setProject(data);
      const admin = data.users
        .find((user) => user.scim_id === session?.session?.user?.scim_id)
        ?.roles.map((role) => role.type)
        .includes(UserRoleType.Admin);
      setIsAdmin(admin || false);

      if (
        session?.session?.user?.permission_level === PermissionLevel.SuperAdmin
      ) {
        // If the user is a super admin, they are always an admin for this project
        setIsAdmin(true);
      }

      if (
        session?.session?.user?.permission_level === PermissionLevel.SystemAdmin
      ) {
        // If the user is a system admin, if the project owner organization is not in the user's assigned organizations, they are not an admin
        const userOrganizations =
          session.session.user.assigned_organisations || [];
        if (
          data.owner_organisation &&
          userOrganizations.includes(data.owner_organisation)
        ) {
          setIsAdmin(true);
        }

        const userLectorates = session.session.user.assigned_lectorates || [];
        if (data.lectorate && userLectorates.includes(data.lectorate)) {
          setIsAdmin(true);
        }
      }

      // Fetch timeline data
      const timeline = await apiClient.projects_GetProjectTimeline(id);
      setTimelineData(timeline);

      setError(null);
    } catch (err) {
      const swaggerError =
        err instanceof SwaggerException
          ? err
          : new SwaggerException(
              "An error occurred",
              0,
              JSON.stringify(err),
              {},
              err,
            );
      setError(swaggerError);
      console.error("Error fetching project:", err);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Function to update specific project fields without a full reload
  const handleProjectUpdate = () => {
    // Clear cache since we're updating the project
    if (id) {
      projectCache.removeFromCache(id);
    }

    // Only update the project data without showing loading indicators
    const fetchWithoutIndicators = async () => {
      if (!id) return;

      try {
        // Fetch the updated project data silently in the background
        const data = await apiClient.projects_GetProjectById(id);

        // Update state without triggering loading indicators
        setProject((prevProject) => {
          // Only update if we actually have new data and it's different
          if (data && JSON.stringify(data) !== JSON.stringify(prevProject)) {
            return data;
          }
          return prevProject;
        });

        // Also update the timeline data silently
        try {
          const timeline = await apiClient.projects_GetProjectTimeline(id);
          setTimelineData(timeline);
        } catch (timelineErr) {
          console.error("Error updating timeline:", timelineErr);
        }

        // Check if the current user is an admin
        const admin = data.users
          .find((user) => user.scim_id === session?.session?.user?.scim_id)
          ?.roles.map((role) => role.type)
          .includes(UserRoleType.Admin);
        setIsAdmin(admin || false);

        if (
          session?.session?.user?.permission_level ===
          PermissionLevel.SuperAdmin
        ) {
          // If the user is a super admin, they are always an admin for this project
          setIsAdmin(true);
        }

        if (
          session?.session?.user?.permission_level ===
          PermissionLevel.SystemAdmin
        ) {
          // If the user is a system admin, if the project owner organization is not in the user's assigned organizations, they are not an admin
          const userOrganizations =
            session.session.user.assigned_organisations || [];
          if (
            data.owner_organisation &&
            userOrganizations.includes(data.owner_organisation)
          ) {
            setIsAdmin(true);
          }

          const userLectorates = session.session.user.assigned_lectorates || [];
          if (data.lectorate && userLectorates.includes(data.lectorate)) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        // Log error but don't update error state to avoid UI disruption
        console.error("Error updating project:", err);
      }
    };

    fetchWithoutIndicators();
  };

  // Initial data fetch
  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!id) {
    return <div className="p-8 text-center">Project ID is required</div>;
  }

  return (
    <LoadingWrapper
      isLoading={isLoading}
      isInitialLoad={isInitialLoad}
      loadingMessage="Loading project..."
      error={error}
    >
      {project && (
        <>
          <PageLinks
            className="mt-6 mr-auto"
            links={[
              { label: "Overview", ref: overviewRef },
              { label: "Contributors", ref: contributorsRef },
              { label: "Products", ref: productsRef },
            ]}
          />
          <main className="my-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-8 md:col-span-2">
              <Card ref={overviewRef} className="scroll-mt-12" title="Overview">
                <ProjectOverview
                  projectId={id}
                  titles={project.titles}
                  descriptions={project.descriptions}
                  onProjectUpdate={handleProjectUpdate}
                  isAdmin={isAdmin}
                />
              </Card>
              <Card
                ref={contributorsRef}
                className="scroll-mt-12"
                title="Contributors"
              >
                <ProjectContributors
                  project={project}
                  onProjectUpdate={handleProjectUpdate}
                  isAdmin={isAdmin}
                />
              </Card>
              <Card ref={productsRef} className="scroll-mt-12" title="Products">
                <ProjectWorks
                  project={project}
                  onProjectUpdate={handleProjectUpdate}
                  isAdmin={isAdmin}
                />
              </Card>
            </div>
            {/* Side Panel */}
            <div className="space-y-8">
              <ProjectDetails
                project={project}
                onProjectUpdate={handleProjectUpdate}
                isAdmin={isAdmin}
              />
              <ProjectOrganizations
                isAdmin={isAdmin}
                projectId={project.id}
                organizations={project.organisations}
                onProjectUpdate={handleProjectUpdate}
              />
              <RAiDInfo
                projectId={id}
                project={project}
                isAdmin={isAdmin}
                onProjectUpdate={handleProjectUpdate}
              />
              <FundingView project={project}></FundingView>
              <ProjectTimeline timelineData={timelineData}></ProjectTimeline>
            </div>
          </main>
        </>
      )}
    </LoadingWrapper>
  );
}
