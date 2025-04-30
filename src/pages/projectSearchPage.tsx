/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import ProjectCard from "@/components/projectCard";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { OrderByType } from "@team-golfslag/conflux-api-client/src/client";
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
import { useApiQuery } from "@/hooks/useApiQuery";
import { useDebounce } from "@/hooks/useDebounce"; // Assuming you have or create this hook

/** Project Search Page component <br>
 * Fetches projects from the backend using a debounced search term and selected sort order.
 * The first 15 projects matching the query are displayed.
 */
const ProjectSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("relevance"); // Default to relevance

  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 200); // 300ms delay

  function parseOrderBy(sortValue: string): OrderByType | undefined {
    switch (sortValue) {
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
      case "relevance": // Handle relevance case
      default:
        return undefined;
    }
  }

  // Use useApiQuery to fetch data based on debounced search term and sort order
  const {
    data: projects,
    isLoading,
    error,
  } = useApiQuery(
    (apiClient) =>
      apiClient.projects_GetProjectByQuery(
        debouncedSearchTerm,
        undefined, // page, if needed
        undefined, // limit, if needed
        parseOrderBy(sort),
      ),
    [debouncedSearchTerm, sort], // Dependencies for the query
  );

  return (
    <>
      <div className="relative mx-auto w-full max-w-2xl px-4 py-8">
        <Input
          className="mx-auto h-12 w-full max-w-2xl rounded-full text-lg"
          type="search"
          placeholder="Search for title or description.."
          value={searchTerm} // Controlled input
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="text-muted-foreground absolute top-1/2 right-8 -translate-y-1/2" />
      </div>
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="mr-4 ml-auto w-50">
          <SelectValue placeholder="Sort by.." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {/* Use "relevance" as the value */}
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
      <div className="p-6 mx-auto grid max-w-7xl grid-cols-1 gap-4 py-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
        {/* Show loading only on initial load or if projects array is empty */}
        {isLoading && (!projects || projects.length === 0) ? (
          <p className="text-muted-foreground col-span-full text-center">
            Searching projects...
          </p>
        ) : (
          <>
            <Separator className="col-span-full my-4" />
            {error && (
              <h3 className="col-span-full text-center text-red-500">
                Error: {error.message}
              </h3>
            )}
            {/* Ensure projects is defined before checking length */}
            {!isLoading && projects && !error && projects.length === 0 && (
              <h3 className="col-span-full text-center text-gray-500">
                No results found
              </h3>
            )}
            {/* Display project cards - always render if projects exist */}
            {projects &&
              projects.length > 0 &&
              projects
                .slice(0, 15)
                .map((project) => (
                  <ProjectCard project={project} key={project.id} />
                ))}
          </>
        )}
      </div>
    </>
  );
};

export default ProjectSearchPage;

// Example useDebounce hook (create this in e.g., src/hooks/useDebounce.ts)
/*
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
*/
