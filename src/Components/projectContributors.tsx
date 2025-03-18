/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Card, CardContent} from "@/Components/ui/card";
import {Person} from "@/types/models.ts";

type ProjectContributersProps = { people: Person[] }

export default function ProjectContributors(props: ProjectContributersProps) {
    return (
        <section className="space-y-4 bg-white p-6 shadow rounded-lg h-full">
            <h2 className="text-xl font-semibold mb-4">Contributors</h2>
            {props.people.map((person) => (
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
