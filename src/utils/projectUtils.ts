/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
export const determineProjectStatus = (startDate?: Date, endDate?: Date) => {
  const now = new Date();
  if (!startDate)
    return { label: "Not Started", color: "bg-gray-200 text-gray-800" };
  if (startDate > now)
    return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
  if (!endDate)
    return { label: "In Progress", color: "bg-green-100 text-green-800" };
  if (endDate < now)
    return { label: "Completed", color: "bg-purple-100 text-purple-800" };
  return { label: "Active", color: "bg-green-100 text-green-800" };
};
