/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Search } from "lucide-react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { LoadingWrapper } from "@/components/loadingWrapper";
import { useMemo, useState } from "react";

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
      <div className="relative w-full max-w-3xl px-4 py-8 sm:px-12 sm:py-16">
        <Input
          className="mx-auto h-12 w-full max-w-2xl rounded-full text-lg"
          type="search"
          placeholder="Search for any project.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 right-10 -translate-y-1/2 transform sm:right-16" />
      </div>
      <div className="mx-4 flex max-w-7xl flex-wrap justify-center gap-4 pb-16 sm:gap-8">
        <Separator className="my-8" />
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
