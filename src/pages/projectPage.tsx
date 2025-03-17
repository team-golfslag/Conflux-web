/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import { Edit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import ProjectOverview from "@/components/projectOverview";

export default function ProjectPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-secondary p-8">
        {/* Title */}
        <div className="flex items-center justify-between bg-white p-6 text-2xl font-semibold rounded-lg">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
            porttitor.
          </span>
          <button className="bg-primary m-2 text-primary-foreground p-2 rounded-lg transition-colors duration-300 flex items-center justify-center">
            <Edit size={32} />
          </button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="works">Works</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
           <ProjectOverview />
          </TabsContent>
          <TabsContent value="timeline">Hier komt de timeline</TabsContent>
          <TabsContent value="works">Hier komen de works</TabsContent>
        </Tabs>
      </div>
    </>
  );
}
