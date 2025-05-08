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
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ProjectDTO } from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { LoadingWrapper } from "@/components/loadingWrapper";
import ProjectDetails from "@/components/projectDetails.tsx";
import ProjectTimeline from "@/components/projectTimeline.tsx";
import PageLinks from "@/components/pageLinks";

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

  const [project, setProject] = useState<ProjectDTO>();
  const [error, setError] = useState<Error>();
  const apiClient = useContext(ApiClientContext);

  useEffect(() => {
    if (id) {
      apiClient
        .projects_GetProjectById(id)
        .then((p) => {
          setProject(p);
          setError(undefined);
        })
        .catch((e) => setError(e));
    }
  }, [apiClient, id]);

  const overviewRef = useRef<HTMLDivElement>(null);
  const contributorsRef = useRef<HTMLDivElement>(null);
  const worksRef = useRef<HTMLDivElement>(null);

  let content: ReactNode = null;

  if (error) {
    content = (
      <>
        <div className="flex items-center justify-between rounded-lg bg-white p-3 text-2xl font-semibold">
          <span>{error.name}</span>
        </div>
        <div className="p-10" />
        <div className="text-l flex items-center justify-between rounded-lg bg-white p-3">
          <span>{error.message}</span>
        </div>
      </>
    );
  } else if (project) {
    content = (
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
                title={project.primary_title?.text ?? "No title available"}
                description={project.primary_description?.text}
              />
            </Card>
            <Card
              ref={contributorsRef}
              className="scroll-mt-12"
              title="Contributors"
            >
              <ProjectContributors project={project} />
            </Card>
            <Card ref={worksRef} className="scroll-mt-12" title="Works">
              <ProjectWorks products={project.products} />
            </Card>
          </div>
          {/* Side Panel */}
          <aside className="space-y-8">
            <ProjectDetails project={project}></ProjectDetails>
            <ProjectTimeline timelineData={timelineData}></ProjectTimeline>
          </aside>
        </main>
      </>
    );
  }

  return (
    <LoadingWrapper
      isLoading={!project && !error}
      loadingMessage="Loading project..."
    >
      {content}
    </LoadingWrapper>
  );
}
