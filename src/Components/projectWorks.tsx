/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Card, CardContent} from "@/Components/ui/card";

export default function ProjectWorks() {
    return (
        <section className="space-y-4 bg-white p-6 shadow rounded-lg">
            {[1, 2, 3].map((id) => (
                <Card key={id} className="bg-gray-200">
                    <CardContent className="flex items-center gap-4 p-3">
                        <div>
                            <p className="font-semibold">Title</p>
                            <p className="text-sm text-gray-600">Details</p>
                            <p className="text-sm text-gray-600">Link</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}
