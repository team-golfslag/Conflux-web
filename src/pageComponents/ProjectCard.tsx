import Project from "../typing/Project.ts";

type ProjectCardProps = {
    project: Project
}


const ProjectCard = ({project}: ProjectCardProps) => {
    return <div className="bg-white w-screen">
        <h1>{project.title}</h1>
    </div>
}

export default ProjectCard