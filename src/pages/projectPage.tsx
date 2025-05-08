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
import {
  useContext,
  useEffect,
  useState,
  useRef,
  RefObject,
  ReactNode,
} from "react";
  DescriptionType,
  ProjectDescriptionDTO,
  ProjectDTO,
  ProjectPatchDTO,
  ProjectTitleDTO,
  TitleType,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { LoadingWrapper } from "@/components/loadingWrapper";
import ProjectDetails from "@/components/projectDetails.tsx";
import ProjectTimeline from "@/components/projectTimeline.tsx";

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

/**
 * Creates an event handler function that scrolls the element
 * referenced by the provided ref into view smoothly.
 *
 * @param ref - The React ref object pointing to the target HTML element.
 * @returns An event handler function.
 */
function createScrollHandler(ref: RefObject<HTMLElement | null>) {
  return () => {
    // Use optional chaining to safely access current and scrollIntoView
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "center",
    });
  };
}

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

  /**
   * Handles the editing of a project's overview by updating the title and description.
   *
   * @param {string} [title] - The new title for the project's overview. Defaults to an empty string if not provided.
   * @param {string} [description] - The new description for the project's overview. Defaults to an empty string if not provided.
   */
  const handleEditOverview = (title?: string, description?: string) => {
    const titleDto: ProjectTitleDTO[] = [
      new ProjectTitleDTO({
        text: title ?? "",
        type: TitleType.Primary,
        start_date: new Date(),
      }),
    ];
    const descriptionDto: ProjectDescriptionDTO[] = [
      new ProjectDescriptionDTO({
        text: description ?? "",
        type: DescriptionType.Primary,
      }),
    ];

    if (id) {
      apiClient
        .projects_PatchProject(
          id,
          new ProjectPatchDTO({
            titles: titleDto,
            descriptions: descriptionDto,
          }),
        )
        .then((p) => {
          setProject(p);
          setError(undefined);
        })
        .catch((e) => setError(e));
    }
  };

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
    const scrollToOverview = createScrollHandler(overviewRef);
    const scrollToContributors = createScrollHandler(contributorsRef);
    const scrollToWorks = createScrollHandler(worksRef);

    content = (
      <>
        <ul className="mt-6 mr-auto flex w-auto items-baseline gap-3 divide-x divide-gray-400 px-4 py-2">
          <li className="pr-3">
            <button
              onClick={scrollToOverview}
              onKeyDown={scrollToOverview}
              className="block w-full cursor-pointer font-semibold text-gray-500 decoration-gray-500 hover:underline"
            >
              Overview
            </button>
          </li>
          <li className="pr-3">
            <button
              onClick={scrollToContributors}
              onKeyDown={scrollToContributors}
              className="block w-full cursor-pointer font-semibold text-gray-500 decoration-gray-500 hover:underline"
            >
              Contributors
            </button>
          </li>
          <li>
            <button
              onClick={scrollToWorks}
              onKeyDown={scrollToWorks}
              className="block w-full cursor-pointer font-semibold text-gray-500 decoration-gray-500 hover:underline"
            >
              Works
            </button>
          </li>
        </ul>
        <main className="my-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-8 md:col-span-2">
            <Card ref={overviewRef} className="scroll-mt-12" title="Overview">
              <ProjectOverview
                title={project.primary_title?.text ?? "No title available"}
                description={project.primary_description?.text}
                onSave={handleEditOverview}
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
