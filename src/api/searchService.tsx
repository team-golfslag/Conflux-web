/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {queryOptions} from "@tanstack/react-query"
import config from "../../config.tsx"

/**
 * Creates a search query to be executed in the search page.
 * @param query the string used for querying the backend
 */
export function searchQuery(query: string) {
    return queryOptions({
        queryKey: ["projects", query],
        queryFn: () => {
            return query === "" ? getAllSearchResults() : getSearchResults(query)
        }
    })
}

/**
 * The data fetching for getting all projects
 */
const getAllSearchResults = async () => {
    const response = await fetch(`${config.apiBaseURL}/projects/all`)

    if (!response.ok) {
        throw new Error("No projects found")
    }

    return response.json()
}

/**
 * The actual data fetching for getting a single project query
 * @param query the string used for querying the backend
 */
const getSearchResults = async (query: string) => {
    const response = await fetch(`${config.apiBaseURL}/projects/?query=${query}`)

    if (!response.ok) {
        throw new Error("No projects found")
    }

    return response.json()
}
