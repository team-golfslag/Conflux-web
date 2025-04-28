/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Collaboration } from "@team-golfslag/conflux-api-client/src/client";
import dashboardCard from "@/components/dashboardCard";
import { JSX } from "react";

const DashboardListView = (data: Collaboration[] | undefined): JSX.Element => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((project, index) => dashboardCard(project, index))}
    </div>
  );
};

export default DashboardListView;
