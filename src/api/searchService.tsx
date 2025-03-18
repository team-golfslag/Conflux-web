/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {queryOptions} from "@tanstack/react-query"
import config from "../../config.tsx"

export function createSearchQuery() { //call this inside useQuery()
    return queryOptions({
        queryKey: ["search"],
        queryFn: getSearchResults
    })
}

const getSearchResults = async () => {
    const response = await fetch(`${config.apiBaseURL}/projects/query/ProjectsQuery/all`)

    if (!response.ok) {
        throw new Error("Project not found")
    }

    return response.json()
}