/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import DashboardCard, { DashboardCardProps } from "@/components/dashboardCard";
import { JSX } from "react";

interface DashboardListViewProps {
  data: DashboardCardProps[] | undefined;
}

const DashboardListView = ({ data }: DashboardListViewProps): JSX.Element => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((cardProps, index) => (
        <DashboardCard key={index} {...cardProps} />
      ))}
    </div>
  );
};

export default DashboardListView;
