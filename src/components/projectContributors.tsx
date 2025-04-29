/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card, CardContent } from "@/components/ui/card";
import { Contributor } from "@team-golfslag/conflux-api-client/src/client";

type ProjectContributorsProps = {
  people?: Contributor[];
  onSelect?: (contributorId: string) => void;
};

/**
 * Project Contributors component
 * @param props the people to be turned into a card
 */
export default function ProjectContributors({
  people,
  onSelect,
}: Readonly<ProjectContributorsProps>) {
  return (
    <section className="h-full space-y-4 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Contributors</h2>
      {people?.map((person) => (
        <Card
          key={person.id}
          onClick={() => onSelect?.(person.id)}
          className="bg-gray-200"
        >
          <CardContent className="flex items-center gap-4 p-3">
            <div className="h-12 w-12 rounded-full bg-gray-500" />
            <div>
              <p className="font-semibold">{person.name}</p>
              <p className="text-sm text-gray-600">Role</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
