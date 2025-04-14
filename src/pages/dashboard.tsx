/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { searchQuery } from "@/api/searchService";
import { userSessionQuery } from "@/api/userSessionService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { truncate } from "lodash";
import { Link } from "react-router";

const Dashboard = () => {
  const { data: userData, isLoading: userLoading } =
    useQuery<User>(userSessionQuery());
  const { data: projectData, isLoading: projectLoading } = useQuery<Project[]>(
    searchQuery(""),
  );
  if (userLoading || projectLoading)
    return (
      <>
        <div className="bg-secondary min-h-full p-8">
          <div className="flex items-center justify-between rounded-lg bg-white p-3 text-2xl font-semibold">
            <span>Loading...</span>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div className="h-full max-h-screen space-y-6 p-6">
        {/* Welcome Banner */}
        <div className="rounded-m bg-primary rounded-lg p-4 text-white shadow-md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Welcome, {userData?.name}!
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Here's an overview of your current projects:
          </p>
        </div>

        {/* User's Projects Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projectData?.map((project, index) => (
            <Card
              key={index}
              className="flex h-60 flex-col gap-0 py-0 pt-6 shadow-md"
            >
              <CardHeader className="bg-gray-100 p-4">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {project.title}
                </h4>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col p-4 wrap-break-word">
                {/* Project Description (truncated if too long) */}
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {truncate(project.description, {
                    length: 100,
                    separator: " ",
                    omission: "...",
                  })}
                </p>
                <div className="flex-grow"></div>
                <div className="flex justify-end">
                  <p className="text-sm leading-7 text-gray-500 [&:not(:first-child)]:mt-6">
                    {/* only show first 3 roles */}
                    Roles:{" "}
                    {project.roles!.length > 3
                      ? project
                          .roles!.slice(0, 3)
                          .map((role) => role.name)
                          .join(", ") + "..."
                      : project.roles!.map((role) => role.name).join(", ")}
                  </p>
                  <div className="flex-grow"></div>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
