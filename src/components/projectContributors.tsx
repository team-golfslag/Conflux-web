/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card } from "@/components/ui/card";
import { Contributor } from "@team-golfslag/conflux-api-client/src/client";

type ProjectContributorsProps = { contributors?: Contributor[] };

/**
 * Project Contributors component
 * @param props the people to be turned into a card
 */
export default function ProjectContributors({
  contributors,
}: Readonly<ProjectContributorsProps>) {
  return (
    <>
      <h2 className="text-xl font-semibold">Contributors</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {contributors?.map((contributor) => (
          <Card
            key={contributor.id}
            className="flex-row items-center gap-4 border border-gray-200 p-3 shadow-sm"
          >
            <div>
              <p className="font-semibold">{contributor.name}</p>
              <p className="text-sm text-gray-600">
                {contributor.roles.map((role) => role.name).join(", ")}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
