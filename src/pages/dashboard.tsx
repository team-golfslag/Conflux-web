/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import DashboardListView from "@/components/dashboardListView";
import { LoadingWrapper } from "@/components/loadingWrapper";
import { useSession } from "@/hooks/SessionContext";
import { ProjectCardProps } from "@/components/projectCard";
import {
  ProjectResponseDTO,
  UserSessionResponseDTO,
  UserResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { useCallback, useContext } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useProjectCache } from "@/hooks/useProjectCache";

const Dashboard = () => {
  const { session, saveSession } = useSession();
  const apiClient = useContext(ApiClientContext);
  const projectCache = useProjectCache();

  // Fetch projects data with caching
  const {
    data: projects,
    isLoading,
    isInitialLoad,
    error,
  } = useDashboardData();

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback(
    async (projectId: string, isFavorite: boolean) => {
      if (!session?.user) return;

      // Store original favorites for rollback
      const originalFavorites = session.user.favourite_project_ids || [];

      // Create updated favorites array
      const updatedFavorites = isFavorite
        ? [...originalFavorites, projectId]
        : originalFavorites.filter((id) => id !== projectId);

      // Create a completely new session object to ensure React detects the change
      const updatedUser = new UserResponseDTO({
        ...session.user,
        favourite_project_ids: updatedFavorites,
      });

      const updatedSession = new UserSessionResponseDTO({
        ...session,
        user: updatedUser,
      });

      // Update session immediately for instant UI feedback
      saveSession(updatedSession);

      try {
        // Call the API to update favorite status in the background
        await apiClient.projects_FavoriteProject(projectId, isFavorite);

        // Invalidate dashboard cache since favorites have changed
        // This will cause fresh data to be fetched next time
        const cachedData = projectCache.getCachedDashboardData();
        if (cachedData) {
          // Update the cached project's favorite status immediately
          const updatedProjects = cachedData.projects.map((project) => {
            if (project.id === projectId) {
              // Note: The favorite status is managed in the session, not the project data
              // So we don't need to modify the project object itself
            }
            return project;
          });
          projectCache.setCachedDashboardData(updatedProjects);
        }
      } catch {
        // Revert the optimistic update on error
        const revertedUser = new UserResponseDTO({
          ...session.user,
          favourite_project_ids: originalFavorites,
        });

        const revertedSession = new UserSessionResponseDTO({
          ...session,
          user: revertedUser,
        });
        saveSession(revertedSession);
      }
    },
    [session, saveSession, apiClient, projectCache],
  );

  // Function to transform projects data to match DashboardCardProps format
  // Using useCallback to make it reactive to session changes
  const transformProjects = useCallback(
    (projects: ProjectResponseDTO[]): ProjectCardProps[] => {
      return projects.map((project) => {
        // Find the current user in the project
        const currentUser = project.users.find(
          (user) => user.scim_id === session?.user?.scim_id,
        );

        // Extract roles array if the user is found, otherwise default to empty array
        const roles = currentUser?.roles
          ? currentUser.roles.map((role) => role.type)
          : [];

        // Check if project is favorited - this will now update when session changes
        const isFavorite =
          session?.user?.favourite_project_ids?.includes(project.id) ?? false;

        return {
          project,
          roles,
          isFavorite,
          onFavoriteToggle: handleFavoriteToggle,
        };
      });
    },
    [
      session?.user?.scim_id,
      session?.user?.favourite_project_ids,
      handleFavoriteToggle,
    ],
  );

  // Sort projects: favorites first, then by recently accessed
  const sortProjects = useCallback(
    (projectCards: ProjectCardProps[]): ProjectCardProps[] => {
      const recentlyAccessedIds =
        session?.user?.recently_accessed_project_ids || [];

      return projectCards.sort((a, b) => {
        // Favorites always come first
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;

        // If both are favorites or both are not favorites, sort by recently accessed
        const aIndex = recentlyAccessedIds.indexOf(a.project.id);
        const bIndex = recentlyAccessedIds.indexOf(b.project.id);

        // If both are in recently accessed, sort by position in array (most recent first)
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }

        // Recently accessed projects come first
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        // For non-recently accessed, sort alphabetically by title
        const titleA =
          a.project.titles?.find((t) => t.type === "Primary")?.text || "";
        const titleB =
          b.project.titles?.find((t) => t.type === "Primary")?.text || "";
        return titleA.localeCompare(titleB);
      });
    },
    [session?.user?.recently_accessed_project_ids],
  );

  // Transform and sort projects - this will update whenever session changes
  const projectCards = projects ? transformProjects(projects) : [];
  const sortedProjects = sortProjects(projectCards);
  const favoriteCount = sortedProjects.filter((card) => card.isFavorite).length;

  return (
    <LoadingWrapper
      isLoading={isLoading}
      isInitialLoad={isInitialLoad}
      error={error}
      loadingMessage="Loading your projects..."
      mode="page"
    >
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
                {session?.user?.person?.name?.split(" ")[0] || session?.name}
              </h1>
              <p className="text-xl font-light opacity-90">
                Manage and track your research projects in one place
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 text-3xl font-semibold text-gray-900">
                    Your Projects
                  </h2>
                  <p className="text-gray-600">
                    {sortedProjects.length} project
                    {sortedProjects.length !== 1 ? "s" : ""}
                    {favoriteCount > 0 &&
                      ` (${favoriteCount} favorite${favoriteCount !== 1 ? "s" : ""})`}
                  </p>
                </div>
              </div>

              {/* Single Projects List */}
              {sortedProjects.length > 0 ? (
                <DashboardListView
                  key={`projects-${favoriteCount}-${session?.user?.favourite_project_ids?.join(",") || ""}`}
                  data={sortedProjects}
                />
              ) : (
                <DashboardListView data={[]} />
              )}
            </div>
          </div>
        </div>
      </div>
    </LoadingWrapper>
  );
};

export default Dashboard;
