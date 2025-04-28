/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "@/components/dashboardListView";
import { LoadingWrapper } from "@/components/loadingWrapper";
import { useSession } from "@/hooks/SessionContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { DashboardCardProps } from "@/components/dashboardCard";

const Dashboard = () => {
  const { session } = useSession();
  const { data: projects, isLoading } = useApiQuery(
    (apiClient) => apiClient.projects_GetAllProjects(),
    [],
  );

  // Transform the API response to match DashboardCardProps format
  const projectCards: DashboardCardProps[] | undefined = projects?.map(
    (project) => {
      // Find the current user in the project
      const currentUser = project.users.find(
        (user) => user.id === session?.user?.id,
      );

      // Extract roles if the user is found, otherwise use default text
      const roleText = currentUser?.roles
        ? currentUser.roles.map((role) => role.name).join(", ")
        : "No role assigned";

      return {
        project: project,
        role: roleText,
      };
    },
  );

  return (
    <LoadingWrapper
      isLoading={isLoading}
      loadingMessage="Loading your projects..."
    >
      <div className="h-full space-y-6 p-6">
        {/* Welcome Banner */}
        <div className="rounded-m bg-primary rounded-lg p-4 text-white shadow-md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Welcome, {session?.name}!
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Here's an overview of your current projects:
          </p>
        </div>

        {/* User's Projects Section */}
        <DashboardListView data={projectCards} />
      </div>
    </LoadingWrapper>
  );
};

export default Dashboard;
