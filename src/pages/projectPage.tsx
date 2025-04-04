/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import Header from "@/components/header.tsx";
import {Edit} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProjectOverview from "@/components/projectOverview.tsx";
import ProjectContributors from "@/components/projectContributors";
import ProjectWorks from "@/components/projectWorks";
import Timeline, {TimelineItem} from "@/components/timeline";
import {Project} from "@/types/project.ts";
import {Link, useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {projectQuery} from "@/api/projectService.tsx";


/** List of timeline data as dummy data */
const timelineData: TimelineItem[] = [
    {date: "01-01-2023", name: "Event One"},
    {date: "15-03-2023", name: "Event Two"},
    {date: "10-06-2023", name: "Event Three"},
    {date: "22-09-2023", name: "Event Four"},
];

/** Project page component <br>
 * Uses the 'id' param from the react routing to get the correct page from the backend
 */
export default function ProjectPage() {

    const {id} = useParams();
    const projectId = id ?? "";
    const {data, error, isLoading} = useQuery<Project>(projectQuery(projectId));
    if (isLoading) return (
        <>
            <Header/>
            <div className="min-h-full bg-secondary p-8">
                <div className="flex items-center justify-between bg-white p-3 text-2xl font-semibold rounded-lg">
                    <span>
                        Loading...
                    </span>
                </div>
            </div>
        </>
    )
    if (error) return (
        <>
            <Header/>
            <div className="min-h-full bg-secondary p-8">
                <div className="flex items-center justify-between bg-white p-3 text-2xl font-semibold rounded-lg">
                    <span>
                        {error.name}
                    </span>
                </div>
                <div className="p-10"/>
                <div className="flex items-center justify-between bg-white p-3 text-l rounded-lg">
                    <span>
                        {error.message}
                    </span>
                </div>
            </div>
        </>
    )
    const project = data as Project;

    return (
        <>
            <Header/>
            <div className="min-h-full bg-secondary p-8">
                {/* Title */}
                <div className="flex items-center justify-between bg-white p-3 text-2xl font-semibold rounded-lg">
                    <span>
                        {project.title}
                    </span>
                    <Link
                        to="edit"
                        className="bg-primary m-2 text-primary-foreground p-2 rounded-lg transition-colors duration-300 flex items-center justify-center">
                        <Edit size={24}/>
                    </Link>
                </div>

                <main className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-2">
                        <Tabs defaultValue="overview" className="h-full w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                                <TabsTrigger value="works">Works</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">
                                <ProjectOverview description={project.description}/>
                            </TabsContent>
                            <TabsContent value="contributors">
                                <ProjectContributors people={project.people}/>
                            </TabsContent>
                            <TabsContent value="works">
                                <ProjectWorks products={project.products}/>
                            </TabsContent>
                        </Tabs>
                    </div>
                    {/* Side Panel */}
                    <aside className="space-y-6">
                        <div className="bg-white p-4 shadow rounded-lg">
                            <h3 className="text-lg font-semibold">Start Date</h3>
                            <p>{project.start_date?.toDateString()}</p>
                            <h3 className="text-lg font-semibold mt-4">End Date</h3>
                            <p>{project.end_date?.toDateString()}</p>
                        </div>

                        {/* Contributors Section */}
                        <div className="bg-white p-4 shadow rounded-lg">
                            <h3 className="text-lg font-semibold">Timeline</h3>
                            <div className="mt-4 ml-3 space-y-4">
                                <Timeline items={timelineData}/>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </>
    );
}
