import Project from "../typing/Project.ts";

type ProjectCardProps = {
    project: Project
}


const ProjectCard = ({project}: ProjectCardProps) => {
    return <div className="bg-white max-w-4xl rounded border-2 border-gray-400 px-4 py-2 flex row space-between ">
                <div className="mx-4 max-w-xl">
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
                </div>
                <div className="mx-4">
                    <p>start date: {project.startDate?.toDateString()}</p>
                    <p>end date: {project.endDate?.toDateString()}</p>
                </div>
            </div>
}

export default ProjectCard