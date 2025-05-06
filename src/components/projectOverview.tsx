/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Link } from "react-router";
import { Edit } from "lucide-react";

type ProjectOverviewProps = { title?: string; description?: string };

/**
 * Project Overview component
 * @param props the description to be displayed
 */
export default function ProjectOverview(props: Readonly<ProjectOverviewProps>) {
  return (
    <>
      {/* Title */}
      <div className="items-ba flex rounded-lg bg-white pb-4 text-4xl font-semibold">
        <span>{props.title}</span>
        <Link
          to="edit"
          className="m-2 flex items-center justify-center rounded-lg transition-colors duration-100 hover:bg-gray-100"
        >
          <Edit size={24} />
        </Link>
      </div>
      <p className="leading-6.5 text-gray-700">{props.description}</p>
    </>
  );
}
