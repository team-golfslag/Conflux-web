/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import Header from "@/Components/header.tsx";
import {Edit} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/Components/ui/tabs";
import ProjectOverview from "@/Components/projectOverview.tsx";
import ProjectContributors from "@/Components/projectContributors";
import ProjectWorks from "@/Components/projectWorks";
import Timeline, {TimelineItem} from "@/Components/timeline";

const timelineData: TimelineItem[] = [
    {date: "01-01-2023", name: "Event One"},
    {date: "15-03-2023", name: "Event Two"},
    {date: "10-06-2023", name: "Event Three"},
    {date: "22-09-2023", name: "Event Four"},
];

export default function ProjectPage() {
    return (
        <>
            <Header/>
            <div className="min-h-full bg-secondary p-8">
                {/* Title */}
                <div className="flex items-center justify-between bg-white p-3 text-2xl font-semibold rounded-lg">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
            porttitor.
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
                                <ProjectOverview/>
                            </TabsContent>
                            <TabsContent value="contributors">
                                <ProjectContributors/>
                            </TabsContent>
                            <TabsContent value="works">
                                <ProjectWorks/>
                            </TabsContent>
                        </Tabs>
                    </div>
                    {/* Side Panel */}
                    <aside className="space-y-6">
                        <div className="bg-white p-4 shadow rounded-lg">
                            <h3 className="text-lg font-semibold">Start Date</h3>
                            <p>12-3-2025</p>
                            <h3 className="text-lg font-semibold mt-4">End Date</h3>
                            <p>1-6-2025</p>
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
