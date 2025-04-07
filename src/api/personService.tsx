/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { queryOptions, UseMutationOptions } from "@tanstack/react-query";
import config from "@/config.ts";
import { Person } from "@/types/person.ts";

export function createPersonQuery(name: string): UseMutationOptions<Person> {
  return {
    mutationFn: () => createPerson(name),
  };
}

const createPerson = async (personName: string): Promise<Person> => {
  const response = await fetch(`${config.apiBaseURL}/people`, {
    method: "POST",
    body: JSON.stringify({ name: personName }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
};

/**
 * Creates a search query to be executed in the search page.
 * @param query the string used for querying the backend
 */
export function searchPeopleQuery(query: string) {
  return queryOptions({
    queryKey: ["people", query],
    queryFn: () => {
      return getSearchResults(query);
    },
  });
}

/**
 * The actual data fetching for getting a single person query
 * @param query the string used for querying the backend
 */
const getSearchResults = async (query: string) => {
  const response = await fetch(`${config.apiBaseURL}/people/?query=${query}`);

  if (!response.ok) {
    throw new Error("No people found");
  }

  return response.json();
};
