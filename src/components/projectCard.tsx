/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Project } from "../types/project.ts";
import { Link } from "react-router";
import logo from "@/assets/golfslag.png";

type ProjectCardProps = {
  project: Project;
};

/**
 * Project Card component
 * @param props the project to be turned into the card
 */
const ProjectCard = (props: ProjectCardProps) => {
  return (
    <Link
      to={`/projects/${props.project.id}`}
      className="border-border my-2 flex max-h-49 w-2/3 rounded-lg border-2 bg-white px-4 py-4 duration-300 hover:cursor-pointer hover:border-purple-700 hover:shadow-lg hover:shadow-gray-300"
    >
      <div className="mx-4 flex w-1/6 justify-center">
        <img
          className="max-h-full max-w-full rounded-full object-contain"
          src={logo}
          alt="logo"
        />
      </div>
      <div className="mx-2 flex w-full flex-col overflow-y-clip p-2">
        <h2 className="mb-3 text-4xl">{props.project.title}</h2>
        <p className="text-left text-base">{props.project.description}</p>
      </div>
    </Link>
  );
};

export default ProjectCard;
