/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { userSessionQuery } from "@/api/userSessionService";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { truncate } from "lodash";

const Dashboard = () => {
  const { data, isLoading } = useQuery<User>(userSessionQuery());
  if (isLoading)
    return (
      <>
        <Header />
        <div className="bg-secondary min-h-full p-8">
          <div className="flex items-center justify-between rounded-lg bg-white p-3 text-2xl font-semibold">
            <span>Loading...</span>
          </div>
        </div>
      </>
    );
  return (
    <>
      <Header />
      <div className="h-full max-h-screen space-y-6 p-6">
        {/* Welcome Banner */}
        <div className="rounded-m bg-primary rounded-lg p-4 text-white shadow-md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Welcome, {data?.name}!
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Here's an overview of your current projects:
          </p>
        </div>

        {/* User's Projects Section */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.collaborations.map((project, index) => (
            <Card key={index} className="flex flex-col shadow-md">
              <CardHeader className="rounded-t-md bg-gray-100 p-4">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  {project.collaboration_group.display_name}
                </h4>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col p-4">
                {/* Project Description (truncated if too long) */}
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {truncate(project.collaboration_group.description, {
                    length: 100,
                    separator: " ",
                    omission: "...",
                  })}
                </p>
                <div className="flex-grow"></div>
                <div className="flex justify-end">
                  <p className="text-sm leading-7 text-gray-500 [&:not(:first-child)]:mt-6">
                    Role: not available
                  </p>
                  <div className="flex-grow"></div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
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
