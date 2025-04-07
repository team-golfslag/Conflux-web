/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product.ts";

type ProjectWorksProps = { products?: Product[] };

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks({
  products,
}: Readonly<ProjectWorksProps>) {
  return (
    <section className="space-y-4 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Works</h2>
      {products?.map((product) => (
        <Card key={product.id} className="bg-gray-200">
          <CardContent className="flex items-center gap-4 p-3">
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-gray-600">Details</p>
              <p className="text-sm text-gray-600">{product.url}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
