/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Project } from "@team-golfslag/conflux-api-client/src/client";
import dashboardCard from "@/components/ui/dashboardCard.tsx";

const DashboardListView = (ps?: Project[]) => {
  {
    return ps?.map((p: Project, index: number) => dashboardCard(p, index));
  }
};

export default DashboardListView;
