/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useContext, useEffect, useState } from "react";
import {
  Project,
  OrderByType,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { Search } from "lucide-react";
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
 * Fetches projects from the backend while typing using the refetch function.
 * The first 10 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [projects, setProjects] = useState<Project[]>();
  const [cancelRequest, setCancelRequest] = useState<() => void>();
  const [error, setError] = useState<Error>();

  const apiClient = useContext(ApiClientContext);

  function parseOrderBy(sort: string): OrderByType | undefined {
    switch (sort) {
      case "title_asc":
        return OrderByType.TitleAsc;
      case "title_desc":
        return OrderByType.TitleDesc;
      case "start_date_asc":
        return OrderByType.StartDateAsc;
      case "start_date_desc":
        return OrderByType.StartDateDesc;
      case "end_date_asc":
        return OrderByType.EndDateAsc;
      case "end_date_desc":
        return OrderByType.EndDateDesc;
      default:
        return undefined;
    }
  }

  useEffect(() => {
    let isCanceled = false;
    if (cancelRequest) cancelRequest();
    setCancelRequest(() => () => {
      isCanceled = true;
    });
    apiClient
      .projects_GetProjectByQuery(
        searchTerm,
        undefined,
        undefined,
        parseOrderBy(sort),
      )
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
  }, [apiClient, searchTerm, sort]);

  return (
    <>
      <div className="relative my-8 w-full max-w-2xl px-4 sm:mx-12 sm:mt-16">
        <Input
          className="z-10 mx-auto h-12 w-full max-w-2xl rounded-full text-lg"
          type="search"
          placeholder="Search for title or description.."
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
            <SelectItem value=" ">Relevance</SelectItem>
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
        <Separator className="my-4" />
        {!projects && <h3>Loading...</h3>}
        {error && <h3>Error: {error.message}</h3>}
        {projects && !error && projects.length === 0 && (
          <h3>No results found</h3>
        )}
        {projects
          ?.slice(0, 15)
          .map((project) => <ProjectCard project={project} key={project.id} />)}
      </div>
    </>
  );
};

export default ProjectSearchPage;
