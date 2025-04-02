/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Card, CardContent} from "@/components/ui/card";
import {Person} from "@/types/person.ts";

type ProjectContributorsProps = { people?: Person[] }

/**
 * Project Contributors component
 * @param props the people to be turned into a card
 */
export default function ProjectContributors({people}: Readonly<ProjectContributorsProps>) {
    return (
        <section className="space-y-4 bg-white p-6 shadow rounded-lg h-full">
            <h2 className="text-xl font-semibold mb-4">Contributors</h2>
            {people?.map((person) => (
                <Card key={person.id} className="bg-gray-200">
                    <CardContent className="flex items-center gap-4 p-3">
                        <div className="w-12 h-12 bg-gray-500 rounded-full"/>
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
