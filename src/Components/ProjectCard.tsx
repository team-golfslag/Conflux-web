import {Project} from "../types/models.ts";

type ProjectCardProps = {
    project: Project
}


const ProjectCard = ({project}: ProjectCardProps) => {
    return <div
        className="bg-white w-2/3 max-h-49 rounded-lg border-2 border-border px-4 py-4 flex duration-300 hover:shadow-lg hover:shadow-gray-300 hover:border-purple-700 hover:cursor-pointer my-2">
        <div className="w-1/6 mx-4 flex justify-center">
            <img className="rounded-full  max-w-full max-h-full object-contain" src="/src/assets/Golfslag.png"
                 alt="team photo"/>
        </div>
        <div className="flex flex-col mx-2 w-full p-2 overflow-y-clip">
            <h2 className="text-4xl mb-3">{project.title}</h2>
            <p className="text-base text-left">{project.description}</p>
        </div>
    </div>
}

export default ProjectCard