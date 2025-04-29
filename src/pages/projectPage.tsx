/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectOverview from "@/components/projectOverview.tsx";
import ProjectContributors from "@/components/projectContributors";
import ProjectWorks from "@/components/projectWorks";
import Timeline, { TimelineItem } from "@/components/timeline";
import { Link, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { Project } from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";

/** List of timeline data as dummy data */
const timelineData: TimelineItem[] = [
  { date: "01-01-2023", name: "Event One" },
  { date: "15-03-2023", name: "Event Two" },
  { date: "10-06-2023", name: "Event Three" },
  { date: "22-09-2023", name: "Event Four" },
];

/** Project page component <br>
 * Uses the 'id' param from the react routing to get the correct page from the backend
 */
export default function ProjectPage() {
  const { id } = useParams();

  const [project, setProject] = useState<Project>();
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

  if (error)
    return (
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

  if (!project)
    return (
      <div className="flex items-center justify-between rounded-lg bg-white p-3 text-2xl font-semibold">
        <span>Loading...</span>
      </div>
    );

  return (
    <>
      {/* Title */}
      <div className="flex items-center justify-between rounded-lg bg-white p-3 text-2xl font-semibold">
        <span>{project.title}</span>
        <Link
          to="edit"
          className="bg-primary text-primary-foreground m-2 flex items-center justify-center rounded-lg p-2 transition-colors duration-300"
        >
          <Edit size={24} />
        </Link>
      </div>

      <main className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="h-full w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contributors">Contributors</TabsTrigger>
              <TabsTrigger value="works">Works</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <ProjectOverview description={project.description} />
            </TabsContent>
            <TabsContent value="contributors">
              <ProjectContributors people={project.contributors} />
            </TabsContent>
            <TabsContent value="works">
              <ProjectWorks products={project.products} />
            </TabsContent>
          </Tabs>
        </div>
        {/* Side Panel */}
        <aside className="space-y-6">
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold">Start Date</h3>
            <p>{project.start_date?.toDateString()}</p>
            <h3 className="mt-4 text-lg font-semibold">End Date</h3>
            <p>{project.end_date?.toDateString()}</p>
          </div>

          {/* Contributors Section */}
          <div className="rounded-lg bg-white p-4 shadow">
            <h3 className="text-lg font-semibold">Timeline</h3>
            <div className="mt-4 ml-3 space-y-4">
              <Timeline items={timelineData} />
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
