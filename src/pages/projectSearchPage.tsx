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
      <div className="flex flex-row justify-center py-16">
        <Input
          className="w-1/3 rounded-2xl"
          type="search"
          placeholder="Search for any project.."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="mb-8 text-3xl font-bold">Results</h2>
        {!projects && <h3>Loading...</h3>}
        {error && <h3>Error: {error.message}</h3>}
        {projects
          ?.slice(0, 10)
          .map((project) => <ProjectCard project={project} key={project.id} />)}
      </div>
    </>
  );
};

export default ProjectSearchPage;
