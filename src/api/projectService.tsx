/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {queryOptions} from "@tanstack/react-query"
import config from "../../config.tsx"

export function createProjectQuery(projectId: string) { //call this inside useQuery()
    return queryOptions({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId)
    })
}

const getProjectById = async (id: string) => {
    const response = await fetch(`${config.apiBaseURL}/project/${id}`)

    if (!response.ok) {
        throw new Error("Project not found")
    }

    return response.json()
}