import {useQuery} from "@tanstack/react-query";
import {projectQuery} from "@/api/projectService.tsx";

const ProjectDetail = ({projectId}: { projectId: string }) => {
    const {data, error, isLoading} = useQuery(projectQuery(projectId));
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