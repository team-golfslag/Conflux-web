/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Project } from "../types/project.ts";
import ProjectCard from "@/components/projectCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useQuery } from "@tanstack/react-query";
import { searchQuery } from "@/api/searchService.tsx";
import { useState } from "react";
import { Separator } from "@/components/ui/separator.tsx";
import { Search } from "lucide-react";

/** Project Search Page component <br>
 * Fetches projects from the backend while typing using the refetch function.
 * The first 10 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery(searchQuery(searchTerm));

  const projects = (data as Project[]) || [];

  return (
    <>
      <div className="relative w-full max-w-3xl px-12 py-16">
        <Input
          className="mx-auto w-full max-w-2xl rounded-2xl"
          type="search"
          placeholder="Search for any project.."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 right-16 -translate-y-1/2 transform" />
      </div>
      <div className="flex max-w-3xl flex-wrap justify-center gap-8">
        <Separator className="my-8" />
        {isLoading && <h3>Loading...</h3>}
        {error && <h3>Error: {error.message}</h3>}
        {!isLoading && !error && projects.length === 0 && (
          <h3>No results found</h3>
        )}
        {projects.slice(0, 10).map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </>
  );
};

export default ProjectSearchPage;
