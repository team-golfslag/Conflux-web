/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "@/components/dashboardListView";
import { ApiWrapper } from "@/components/apiWrapper";
import { useSession } from "@/hooks/SessionContext";
import { ProjectCardProps } from "@/components/projectCard";
import { ProjectDTO } from "@team-golfslag/conflux-api-client/src/client";

const Dashboard = () => {
  const { session } = useSession();

  // Function to transform projects data to match DashboardCardProps format
  const transformProjects = (projects: ProjectDTO[]): ProjectCardProps[] => {
    return projects.map((project) => {
      // Find the current user in the project
      const currentUser = project.users.find(
        (user) => user.scim_id === session?.user?.scim_id,
      );

      // Extract roles array if the user is found, otherwise default to empty array
      const roles = currentUser?.roles
        ? currentUser.roles.map((role) => role.type)
        : [];

      return {
        project,
        roles,
      };
    });
  };

  return (
    <ApiWrapper
      queryFn={(apiClient) => apiClient.projects_GetAllProjects()}
      loadingMessage="Loading your projects..."
    >
      {(projects) => {
        const projectCards = transformProjects(projects);

        return (
          <div className="min-h-screen pb-12">
            <div className="mx-auto max-w-7xl space-y-8 p-6">
              {/* Welcome Banner with Action Button */}
              <div className="from-primary/90 to-primary flex items-center justify-between rounded-lg bg-gradient-to-r p-6 shadow-md">
                <div className="text-primary-foreground">
                  <h1 className="text-3xl font-bold">
                    {session?.user?.name || session?.name}
                  </h1>
                  <p className="mt-2 opacity-90">
                    Manage and track your research projects in one place
                  </p>
                </div>
              </div>

              {/* Projects Section with Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground text-2xl font-semibold">
                    Your Projects
                  </h2>
                  <div className="flex gap-2">
                    {/* Additional controls could go here */}
                  </div>
                </div>
                <DashboardListView data={projectCards} />
              </div>
            </div>
          </div>
        );
      }}
    </ApiWrapper>
  );
};

export default Dashboard;
