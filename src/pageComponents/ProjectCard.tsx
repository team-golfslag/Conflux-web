import Project from "../typing/Project.ts";

type ProjectCardProps = {
    project: Project
}

const truncater = (str: string, length: number) => {
    return str.substring(0, Math.min(str.length, length)) + "...";
}
const ProjectCard = ({project}: ProjectCardProps) => {
    return <div className="bg-white max-w-5xl rounded border-2 border-gray-400 px-4 py-2 flex">
                <div className="w-1/6">
                    <img className="rounded-full" src="/src/assets/Golfslag.png" alt="team photo"/>
                </div>
        <div className="mx-4 w-3/5">
            <h1>{project.title}</h1>
                    <p className="text-base">{truncater(project.description as string, 350)}</p>
                </div>
                <div className="mx-4">
                    <p className="text-sm">start date: {project.startDate?.toDateString()}</p>
                    <p className="text-sm">end date: {project.endDate?.toDateString()}</p>
                </div>
            </div>
}

export default ProjectCard