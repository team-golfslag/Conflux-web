/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Project} from "@/types/project.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import ProjectForm from "@/pageComponents/ProjectForm.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {editProjectQuery, projectQuery} from "@/api/projectService.tsx";

type ProjectEditParams = {
    id: string
}

const ProjectEdit = () => {

    const { id } = useParams<ProjectEditParams>();

    const [project, setProject] = useState<Project>();
    const {data: initialData, error, isLoading} = useQuery<Project>(projectQuery(id as string));

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !error) {
            setProject(initialData)
        }
    }, [initialData, error, isLoading])

    const {mutate, error: mutationError, isPending, isSuccess} = useMutation(editProjectQuery(id as string, project))

    useEffect(() => {
        if (isSuccess) {
            navigate(`/projects/${id}`)
        }
    }, [isSuccess, navigate, id]);




    if (isLoading) {
        return <h1>Loading...</h1>
    }

    if (error) {
       return <h1>Error loading data.</h1>
    }

    return <>
        <div className="w-screen h-20 bg-primary">
            <h2 className="w-[639px] h-20 justify-center text-accent text-4xl font-bold font-sans text-center">Edit project</h2>
        </div>
        {mutationError && <h1>An error occurred during the request: {mutationError.message}</h1>}
        <ProjectForm initialValue={project}
                     onSubmit={(p) => mutate(p)}
                     disabled={isPending}
        />
    </>
}

export default ProjectEdit