/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { LoadingWrapper } from "@/components/loadingWrapper";

/** Project Search Page component <br>
 * Fetches all projects from the backend once and filters them client-side.
 * The first 10 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all projects just once
  const {
    data: allProjects,
    isLoading,
    error,
  } = useApiQuery((apiClient) => apiClient.projects_GetAllProjects(), []);

  // Filter projects client-side based on search term
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    if (!searchTerm.trim()) return allProjects;

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return allProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(lowercaseSearchTerm) ||
        project.description?.toLowerCase().includes(lowercaseSearchTerm),
    );
  }, [allProjects, searchTerm]);

  return (
    <LoadingWrapper isLoading={isLoading} loadingMessage="Loading projects...">
      <div className="flex flex-row justify-center py-16">
        <Input
          className="w-1/3 rounded-2xl"
          type="search"
          placeholder="Search for any project.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="mb-8 text-3xl font-bold">Results</h2>

        {error && <h3 className="text-red-500">Error: {error.message}</h3>}

        {filteredProjects.length === 0 && !isLoading && !error ? (
          <p className="text-gray-500">
            No projects found matching your search.
          </p>
        ) : (
          filteredProjects
            .slice(0, 15)
            .map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))
        )}
      </div>
    </LoadingWrapper>
  );
};

export default ProjectSearchPage;
