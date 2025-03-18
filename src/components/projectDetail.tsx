import {useQuery} from "@tanstack/react-query";
import {createProjectQuery} from "@/api/projectService.tsx";

const ProjectDetail = ({projectId}: { projectId: string }) => {
    const {data, error, isLoading} = useQuery(createProjectQuery(projectId));
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <div>
            <h2>{data.title}</h2>
            <p>{data.description}</p>
        </div>
    )
}

export default ProjectDetail;