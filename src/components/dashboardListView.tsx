/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import ProjectCard, { ProjectCardProps } from "@/components/projectCard";
import { JSX } from "react";

interface DashboardListViewProps {
  data?: ProjectCardProps[];
}

const DashboardListView = ({ data }: DashboardListViewProps): JSX.Element => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
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
