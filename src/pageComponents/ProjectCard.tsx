import Project from "../typing/Project.ts";

type ProjectCardProps = {
    project: Project
}

const truncater = (str: string, length: number) => {
    return str.substring(0, Math.min(str.length, length)) + "...";
}
const ProjectCard = ({project}: ProjectCardProps) => {
    return<div className="bg-white w-2/3 rounded-lg border-2 border-border px-4 py-4 flex duration-300 hover:shadow-lg hover:shadow-gray-300 hover:border-purple-700">
                <div className="w-1/6 mx-4">
                    <img className="rounded-full p-5" src="/src/assets/Golfslag.png" alt="team photo"/>
                </div>
        <div className="mx-2 w-full p-2">
            <h2 className="text-4xl mb-3">{project.title}</h2>
                    <p className="text-base text-left">{truncater(project.description as string, 350)}</p>
                </div>

            </div>
}

export default ProjectCard