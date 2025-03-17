import Project from "../typing/Project.ts";

type ProjectCardProps = {
    project: Project
}

const truncater = (str: string, length: number) => {
    return str.substring(0, Math.min(str.length, length)) + "...";
}
const ProjectCard = ({project}: ProjectCardProps) => {
    return <div className="bg-white max-w-5xl rounded-lg border-2 border-border px-4 py-2 flex duration-300 hover:shadow-lg hover:shadow-gray-300 hover:border-purple-700">
                <div className="w-1/6 mx-2">
                    <img className="rounded-full" src="/src/assets/Golfslag.png" alt="team photo"/>
                </div>
        <div className="mx-2 w-3/5">
            <h2 className="text-4xl mb-3">{project.title}</h2>
                    <p className="text-base text-left">{truncater(project.description as string, 350)}</p>
                </div>
                <div className="mx-2">
                    <p className="text-sm text-left">Start date: {project.startDate?.toDateString()}</p>
                    <p className="text-sm text-left">End date: {project.endDate?.toDateString()}</p>
                </div>
            </div>
}

export default ProjectCard