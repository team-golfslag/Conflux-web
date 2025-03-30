/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {queryOptions} from "@tanstack/react-query"
import config from "../../config.tsx"

/**
 * Creates a project query to be executed in the project page.
 * @param projectId the string id of the project
 */
export const projectQuery = (projectId: string) => {
    return queryOptions({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId)
    })
};

/**
 * The actual data fetching for a singular project
 * @param projectId the string id of the project
 */
const getProjectById = async (projectId: string) => {
    const response = await fetch(`${config.apiBaseURL}/projects/${projectId}`)

    if (!response.ok) {
        throw new Error("Requested project not found")
    }
    return response.json()
}