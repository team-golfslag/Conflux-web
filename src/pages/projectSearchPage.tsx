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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Project Search Page component <br>
 * Fetches all projects from the backend once and filters them client-side.
 * The first 15 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");

  // Fetch all projects just once
  const {
    data: allProjects,
    isLoading,
    error,
  } = useApiQuery((apiClient) => apiClient.projects_GetAllProjects(), []);

  // Filter and sort projects client-side based on search term and sort option
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];

    // First filter by search term
    let results = [...allProjects];

    if (searchTerm.trim()) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      results = results.filter(
        (project) =>
          project.title.toLowerCase().includes(lowercaseSearchTerm) ||
          project.description?.toLowerCase().includes(lowercaseSearchTerm),
      );
    }

    // Then sort the results
    switch (sort) {
      case "title_asc":
        return results.sort((a, b) => a.title.localeCompare(b.title));
      case "title_desc":
        return results.sort((a, b) => b.title.localeCompare(a.title));
      case "start_date_asc":
        return results.sort((a, b) => {
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return (
            new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          );
        });
      case "start_date_desc":
        return results.sort((a, b) => {
          if (!a.start_date) return 1;
          if (!b.start_date) return -1;
          return (
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          );
        });
      case "end_date_asc":
        return results.sort((a, b) => {
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;
          return (
            new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
          );
        });
      case "end_date_desc":
        return results.sort((a, b) => {
          if (!a.end_date) return 1;
          if (!b.end_date) return -1;
          return (
            new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
          );
        });
      // Use "relevance" as the default case
      case "relevance":
      default:
        return results;
    }
  }, [allProjects, searchTerm, sort]);

  return (
    <LoadingWrapper isLoading={isLoading} loadingMessage="Loading projects...">
      <div className="relative w-full max-w-3xl px-4 py-8 sm:px-12 sm:py-16">
        <Input
          className="z-10 mx-auto h-12 w-full max-w-2xl rounded-full text-lg"
          type="search"
          placeholder="Search for any project.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 right-12 z-0 -translate-y-1/2" />
      </div>

      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="mr-4 ml-auto w-50">
          <SelectValue placeholder="Sort by.." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="title_asc">Title A-Z</SelectItem>
            <SelectItem value="title_desc">Title Z-A</SelectItem>
            <SelectItem value="start_date_asc">Start date ascending</SelectItem>
            <SelectItem value="start_date_desc">
              Start date descending
            </SelectItem>
            <SelectItem value="end_date_asc">End date ascending</SelectItem>
            <SelectItem value="end_date_desc">End date descending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
