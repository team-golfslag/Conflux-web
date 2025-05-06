/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContributorDTO } from "@team-golfslag/conflux-api-client/src/client";

type ProjectContributorsProps = { contributors?: ContributorDTO[] };

/**
 * Project Contributors component
 * @param props the people to be turned into a card
 */
export default function ProjectContributors({
  contributors,
}: Readonly<ProjectContributorsProps>) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {contributors?.map((contributor) => (
            <Card
              key={contributor.person.id}
              className="flex-row items-center gap-4 border border-gray-200 p-3 shadow-sm"
            >
              <div>
                <p className="font-semibold">{contributor.person.name}</p>
                <p className="text-sm text-gray-600">
                  {contributor.roles.map((role) => role).join(", ")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </>
  );
}
