/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import Header from "@/Components/header.tsx";
import {Edit} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Components/ui/tabs";
import ProjectOverview from "@/Components/projectOverview.tsx";
import ProjectContributors from "@/Components/projectContributors";
import ProjectWorks from "@/Components/projectWorks";
import Timeline, {TimelineItem} from "@/Components/timeline";
import {Project} from "@/types/models.ts";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {projectQuery} from "@/api/projectService.tsx";

const timelineData: TimelineItem[] = [
    {date: "01-01-2023", name: "Event One"},
    {date: "15-03-2023", name: "Event Two"},
    {date: "10-06-2023", name: "Event Three"},
    {date: "22-09-2023", name: "Event Four"},
];
export default function ProjectPage() {

    const {id} = useParams();
    // const id = "0195a8cb-d13e-7094-ab80-866561ab0ce1"
    console.log(id)
    const projectId = id ? id : "";
    const {data, error, isLoading} = useQuery(projectQuery(projectId));
    console.log(data)
    if (isLoading) return (<h2>Loading...</h2>)
    if (error) return (<p>{error.message}</p>)
    // return (
    //     <p>{data}</p>
    // )

    const project = data as Project;

    // const project = {
    //     title: "title",
    //     description: "description",
    //     people: [],
    //     products: [],
    //     startDate: new Date(2000, 0, 1),
    //     endDate: new Date(2000, 1, 1)
    // };
    return (
        <>
            <Header/>
            <div className="min-h-full bg-secondary p-8">
                {/* Title */}
                <div className="flex items-center justify-between bg-white p-3 text-2xl font-semibold rounded-lg">
          <span>
            {project.title}
          </span>
                    <button
                        className="bg-primary m-2 text-primary-foreground p-2 rounded-lg transition-colors duration-300 flex items-center justify-center">
                        <Edit size={24}/>
                    </button>
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
                            <p>{project.startDate.toString()}</p>
                            <h3 className="text-lg font-semibold mt-4">End Date</h3>
                            <p>{project.endDate.toString()}</p>
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
