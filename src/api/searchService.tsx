/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {queryOptions} from "@tanstack/react-query"
import config from "../../config.tsx"

export function searchAllQuery() { //call this inside useQuery()
    return queryOptions({
        queryKey: ["search"],
        queryFn: getAllSearchResults
    })
}

const getAllSearchResults = async () => {
    const response = await fetch(`${config.apiBaseURL}/projects/all`)

    if (!response.ok) {
        throw new Error("No projects found")
    }

    return response.json()
}

export function searchQuery(query: string) { //call this inside useQuery()
    return queryOptions({
        queryKey: ["projects", query],
        queryFn: () => getSearchResults(query)
    })
}

const getSearchResults = async (query: string) => {
    const response = await fetch(`${config.apiBaseURL}/projects/?query=${query}`)

    if (!response.ok) {
        throw new Error("No projects found")
    }

    return response.json()
}
