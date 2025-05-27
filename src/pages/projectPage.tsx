/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card } from "@/components/ui/card";
import ProjectOverview from "@/components/projectOverview.tsx";
import ProjectContributors from "@/components/projectContributors";
import ProjectWorks from "@/components/projectWorks";
import { TimeLineImportance, TimelineItem } from "@/components/timeline";
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
  TitleType,
  UserRoleType,
} from "@team-golfslag/conflux-api-client/src/client";
import { useSession } from "@/hooks/SessionContext";

/** List of timeline data as dummy data */
const timelineData: TimelineItem[] = [
  {
    date: "01-01-2023",
    name: "Project Start",
    importance: TimeLineImportance.High,
  },
  {
    date: "05-02-2023",
    name: "Log Item",
    importance: TimeLineImportance.Medium,
  },
  {
    date: "15-03-2023",
    name: "Event One",
    importance: TimeLineImportance.High,
  },
  {
    date: "10-06-2023",
    name: "Event Two",
    importance: TimeLineImportance.High,
  },
  {
    date: "08-07-2023",
    name: "Log Item 1",
    importance: TimeLineImportance.Medium,
  },
  {
    date: "02-08-2023",
    name: "Log Item 2",
    importance: TimeLineImportance.Medium,
  },
  {
    date: "22-09-2023",
    name: "Project End",
    importance: TimeLineImportance.High,
  },
];

/** Project page component <br>
 * Uses the 'id' param from the react routing to get the correct page from the backend
 */
export default function ProjectPage() {
  const { id } = useParams();
  const session = useSession();
  const apiClient = useContext(ApiClientContext);
  const [project, setProject] = useState<ProjectResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<SwaggerException | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const overviewRef = useRef<HTMLDivElement>(null);
  const contributorsRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);

  // Function to fetch the project data
  const fetchProject = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await apiClient.projects_GetProjectById(id);
      setProject(data);
      const admin = data.users
        .find((user) => user.scim_id === session?.session?.user?.scim_id)
        ?.roles.map((role) => role.type)
        .includes(UserRoleType.Admin);
      setIsAdmin(admin || false);

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

        // Check if the current user is an admin
        const admin = data.users
          .find((user) => user.scim_id === session?.session?.user?.scim_id)
          ?.roles.map((role) => role.type)
          .includes(UserRoleType.Admin);
        setIsAdmin(admin || false);
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
      onRetry={fetchProject}
    >
      {project && (
        <>
          <PageLinks
            className="mt-6 mr-auto"
            links={[
              { label: "Overview", ref: overviewRef },
              { label: "Contributors", ref: contributorsRef },
              { label: "Works", ref: worksRef },
            ]}
          />
          <main className="my-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-8 md:col-span-2">
              <Card ref={overviewRef} className="scroll-mt-12" title="Overview">
                <ProjectOverview
                  projectId={id}
                  title={project.titles.find(
                    (title) => title.type === TitleType.Primary,
                  )}
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
              <Card ref={worksRef} className="scroll-mt-12" title="Works">
                <ProjectWorks products={project.products} />
              </Card>
            </div>
            {/* Side Panel */}
            <div className="space-y-8">
              <ProjectDetails
                project={project}
                onProjectUpdate={handleProjectUpdate}
                isAdmin={isAdmin}
              />
              <RAiDInfo projectId={id} project={project} />
              <ProjectTimeline timelineData={timelineData}></ProjectTimeline>
            </div>
          </main>
        </>
      )}
    </LoadingWrapper>
  );
}
