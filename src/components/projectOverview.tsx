/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

type ProjectOverviewProps = { description?: string };

/**
 * Project Overview component
 * @param props the description to be displayed
 */
export default function ProjectOverview(props: Readonly<ProjectOverviewProps>) {
  return (
    <section className="h-full rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Project Description</h2>
      <p className="text-gray-700">{props.description}</p>
    </section>
  );
}
