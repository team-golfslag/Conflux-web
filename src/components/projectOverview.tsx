/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Project course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import { Card, CardContent } from "@/components/ui/card";

export default function ProjectOverview() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {/* Project Description */}
      <section className="md:col-span-2 bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Project Description</h2>
        <p className="text-gray-700">
          Ut sit amet auctor sem. Pellentesque mattis et magna, id malesuada
          ante venenatis in. Nullam ornare dui et dui sollicitudin lobortis. In
          eleifend, turpis sed congue mattis, ligula mi faucibus dui, vitae
          tincidunt turpis elit vitae tellus...
        </p>
      </section>

      {/* Side Panel */}
      <aside className="space-y-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Start Date</h3>
          <p>12-3-2025</p>
          <h3 className="text-lg font-semibold mt-4">End Date</h3>
          <p>1-6-2025</p>
        </div>

        {/* Contributors Section */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">CONTRIBUTERS</h3>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((id) => (
              <Card key={id} className="bg-gray-200">
                <CardContent className="flex items-center gap-4 p-3">
                  <div className="w-12 h-12 bg-gray-500 rounded-full" />
                  <div>
                    <p className="font-semibold">Name</p>
                    <p className="text-sm text-gray-600">Role</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
