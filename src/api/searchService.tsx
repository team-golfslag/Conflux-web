/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import config from "../config";
import { Project } from "@/types/project";

/**
 * Creates a search query to be executed in the search page.
 * @param query the string used for querying the backend
 */
export function searchQuery(query: string): UseQueryOptions<Project[]> {
  return queryOptions({
    queryKey: ["projects", query] as unknown as readonly unknown[],
    queryFn: (): Promise<Project[]> => {
      return query === "" ? getAllSearchResults() : getSearchResults(query);
    },
  });
}

/**
 * The data fetching for getting all projects
 */
const getAllSearchResults = async (): Promise<Project[]> => {
  const response = await fetch(`${config.apiBaseURL}/projects/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No projects found");
  }

  return response.json();
};

/**
 * The actual data fetching for getting a single project query
 * @param query the string used for querying the backend
 */
const getSearchResults = async (query: string): Promise<Project[]> => {
  const response = await fetch(
    `${config.apiBaseURL}/projects/?query=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("No projects found");
  }

  return response.json();
};
