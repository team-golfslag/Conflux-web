/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {UseMutationOptions, UseQueryOptions} from "@tanstack/react-query"
import config from "../../config.tsx"
import {Project} from "@/types/project.ts";

/**
 * Creates a project query to be executed in the project page.
 * @param projectId the string id of the project
 */
export function projectQuery(projectId: string): UseQueryOptions<Project> {
    return {
        queryKey: ["project", projectId],
        queryFn: (): Promise<Project> => getProjectById(projectId)
    }
}

export function editProjectQuery(projectId: string, original?: Project): UseMutationOptions<Project, Error, Project> {
    return {
        mutationFn: (update) => {

            if (!original) {
                throw new Error("No original found");
            }

            const updateRequest: ProjectEditSchema = {
                title: update.title,
                description: update.description ?? undefined ,
                end_date: update.end_date ?? undefined,
                start_date: update.start_date ?? undefined,
            }

            return editProject(projectId, updateRequest)
        }
    }
}

/**
 * The actual data fetching for a singular project
 * @param projectId the string id of the project
 */
const getProjectById = async (projectId: string): Promise<Project> => {
    const response = await fetch(`${config.apiBaseURL}/projects/${projectId}`)

    if (!response.ok) {
        throw new Error("Requested project not found")
    }

    const pseudoProject = await response.json()
    const project: Project = {
        ...pseudoProject,
        start_date: new Date(pseudoProject.start_date),
        end_date: new Date(pseudoProject.end_date),

    }
    return project;
}



type ProjectEditSchema = {
    title?: string,
    description?: string,
    start_date?: Date,
    end_date?: Date,
}



/**
 * The actual data fetching for a singular project
 * @param projectId the string id of the project
 * @param update the fields in the project that should be updated
 */
const editProject = async (projectId: string, update: ProjectEditSchema): Promise<Project> => {
    const response = await fetch(
        `${config.apiBaseURL}/projects/${projectId}`,
        {
            method: 'PUT',
            body: JSON.stringify(update),
            headers: {
                "Content-Type": "application/json"
            }
        })

    if (!response.ok) {
        throw new Error(await response.text())
    }

    const pseudoProject = await response.json()
    const project: Project = {
        start_date: Date.parse(pseudoProject.start_date),
        end_date: Date.parse(pseudoProject.end_date),
        ...pseudoProject,

    }
    return project
}