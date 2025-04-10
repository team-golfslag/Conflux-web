/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Project } from "../types/project.ts";
import ProjectCard from "@/components/projectCard.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useQuery } from "@tanstack/react-query";
import { searchQuery } from "@/api/searchService.tsx";
import { useState } from "react";

/** Project Search Page component <br>
 * Fetches projects from the backend while typing using the refetch function.
 * The first 10 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading, refetch } = useQuery(searchQuery(searchTerm));

  const handleSearch = () => {
    refetch();
  };
  const projects = (data as Project[]) || [];

  return (
    <>
      <div className="flex flex-row justify-center py-16">
        <Input
          className="w-1/3 rounded-2xl"
          type="search"
          placeholder="Search for any project.."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} type="submit">
          Search
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="mb-8 text-3xl font-bold">Results</h2>
        {isLoading && <h3>Loading...</h3>}
        {error && <h3>Error: {error.message}</h3>}
        {projects.slice(0, 10).map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </>
  );
};

export default ProjectSearchPage;
