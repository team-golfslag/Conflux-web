/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useContext, useEffect, useState } from "react";
import { Project } from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { useQuery } from "@tanstack/react-query";
import { searchQuery } from "@/api/searchService.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Search } from "lucide-react";

/** Project Search Page component <br>
 * Fetches projects from the backend while typing using the refetch function.
 * The first 10 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>();
  const [cancelRequest, setCancelRequest] = useState<() => void>();
  const [error, setError] = useState<Error>();

  const apiClient = useContext(ApiClientContext);

  useEffect(() => {
    let isCanceled = false;
    if (cancelRequest) cancelRequest();
    setCancelRequest(() => () => {
      isCanceled = true;
    });
    apiClient
      .projects_GetProjectByQuery(searchTerm)
      .then((ps) => {
        if (!isCanceled) {
          setProjects(ps);
          console.log(ps);
          setCancelRequest(undefined);
        }
      })
      .catch((e) => {
        if (!isCanceled) {
          setError(e);
          setCancelRequest(undefined);
        }
      });
  }, [apiClient, searchTerm]);

  return (
    <>
      <div className="relative w-full max-w-3xl px-4 py-8 sm:px-12 sm:py-16">
        <Input
          className="mx-auto h-12 w-full max-w-2xl rounded-full text-lg"
          type="search"
          placeholder="Search for any project.."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 right-10 -translate-y-1/2 transform sm:right-16" />
      </div>
      <div className="mx-4 flex max-w-7xl flex-wrap justify-center gap-4 pb-16 sm:gap-8">
        <Separator className="my-8" />
        {!projects && <h3>Loading...</h3>}
        {error && <h3>Error: {error.message}</h3>}
        {projects && !error && projects.length === 0 && (
          <h3>No results found</h3>
        )}
        {projects?.slice(0, 10).map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </>
  );
};

export default ProjectSearchPage;
