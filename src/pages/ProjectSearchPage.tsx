import Project from "../typing/Project.ts";
import ProjectCard from "../pageComponents/ProjectCard.tsx";

const ProjectSearchBar = () => {

    const pro: Project = {
        title: "Hoi",
        description: "blablabla",
        id: "09897836754"
    }

    return <>
        <div>Search bar</div>

        <div>Results</div>
        <ProjectCard project={pro}/>
    </>
}

export default ProjectSearchBar