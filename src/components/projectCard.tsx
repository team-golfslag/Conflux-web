/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Project} from "../types/project.ts";
import {Link} from "react-router";

type ProjectCardProps = {
    project: Project
}

/**
 * Project Card component
 * @param props the project to be turned into the card
 */
const ProjectCard = (props: ProjectCardProps) => {
    return <Link
        to={`/projects/${props.project.id}`}
        className="bg-white w-2/3 max-h-49 rounded-lg border-2 border-border px-4 py-4 flex duration-300 hover:shadow-lg hover:shadow-gray-300 hover:border-purple-700 hover:cursor-pointer my-2">
        <div className="w-1/6 mx-4 flex justify-center">
            <img className="rounded-full  max-w-full max-h-full object-contain" src="/src/assets/golfslag.png"
                 alt="team photo"/>
        </div>
        <div className="flex flex-col mx-2 w-full p-2 overflow-y-clip">
            <h2 className="text-4xl mb-3">{props.project.title}</h2>
            <p className="text-base text-left">{props.project.description}</p>
        </div>
    </Link>
}

export default ProjectCard