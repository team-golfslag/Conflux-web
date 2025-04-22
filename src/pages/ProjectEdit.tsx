/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ProjectForm from "@/pageComponents/ProjectForm.tsx";
import {
  Project,
  ProjectPutDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";

type ProjectEditParams = {
  id: string;
};

const ProjectEdit = () => {
  const { id } = useParams<ProjectEditParams>();

  const apiClient = useContext(ApiClientContext);

  const [project, setProject] = useState<Project>();
  const [initialProject, setInitialProject] = useState<Project>();
  const [error, setError] = useState<Error>();
  const [isPending, setIsPending] = useState<boolean>(false);

  const navigate = useNavigate();

  async function mutate(id: string, p: Project): Promise<void> {
    setIsPending(true);

    const projectDTO: ProjectPutDTO = new ProjectPutDTO(p);

    return apiClient
      .projects_PutProject(id, projectDTO)
      .then(() => navigate(`/projects/${id}`))
      .catch((e) => setError(e))
      .finally(() => setIsPending(false));
  }

  useEffect(() => {
    if (id) {
      apiClient
        .projects_GetProjectById(id)
        .then((p) => {
          setProject(p);
          setInitialProject(p);
        })
        .catch((e) => {
          setError(e);
        });
    }
  }, [apiClient, id]);

  if (!id) {
    return <h1>No id given</h1>;
  }

  if (!initialProject) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className="bg-primary h-20 w-screen">
        <h2 className="text-accent h-20 w-[639px] justify-center text-center font-sans text-4xl font-bold">
          Edit project
        </h2>
      </div>
      {error && <h1>An error occurred during the request: {error.message}</h1>}
      <ProjectForm
        initialValue={project}
        onSubmit={(p) => mutate(id, p)}
        disabled={isPending}
      />
    </>
  );
};

export default ProjectEdit;
