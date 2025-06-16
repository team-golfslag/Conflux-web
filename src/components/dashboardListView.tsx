/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import ProjectCard, { ProjectCardProps } from "@/components/projectCard";
import { JSX } from "react";
import { FolderOpen } from "lucide-react";

interface DashboardListViewProps {
  data?: ProjectCardProps[];
}

const DashboardListView = ({ data }: DashboardListViewProps): JSX.Element => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FolderOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            No projects yet
          </h3>
          <p className="max-w-md text-gray-600">
            You don't have any projects assigned to you yet. Check back later or
            contact your project administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {data.map((cardProps, index) => (
        <ProjectCard key={cardProps.project.id || index} {...cardProps} />
      ))}
    </div>
  );
};

export default DashboardListView;
