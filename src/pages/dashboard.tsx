/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "@/components/dashboardListView";
import { ApiWrapper } from "@/components/apiWrapper";
import { useSession } from "@/hooks/SessionContext";
import { ProjectCardProps } from "@/components/projectCard";
import { ProjectResponseDTO } from "@team-golfslag/conflux-api-client/src/client";

const Dashboard = () => {
  const { session } = useSession();

  // Function to transform projects data to match DashboardCardProps format
  const transformProjects = (
    projects: ProjectResponseDTO[],
  ): ProjectCardProps[] => {
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
      mode="page"
    >
      {(projects) => {
        const projectCards = transformProjects(projects);

        return (
          <div className="min-h-screen pb-16">
            <div className="mx-auto max-w-7xl space-y-10 p-6">
              {/* Welcome Banner with Action Button */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-800 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-gray-900/20"></div>
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/5"></div>
                <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5"></div>
                <div className="relative text-white">
                  <h1 className="mb-3 text-4xl font-bold tracking-tight">
                    Welcome back,{" "}
                    {session?.user?.person?.name?.split(" ")[0] ||
                      session?.name}
                  </h1>
                  <p className="text-xl font-light opacity-90">
                    Manage and track your research projects in one place
                  </p>
                </div>
              </div>

              {/* Projects Section with Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-3xl font-semibold text-gray-900">
                      Your Projects
                    </h2>
                    <p className="text-gray-600">
                      {projectCards.length} project
                      {projectCards.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
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
