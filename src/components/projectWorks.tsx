/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@team-golfslag/conflux-api-client/src/client";

type ProjectWorksProps = { products?: Product[] };

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks({
  products,
}: Readonly<ProjectWorksProps>) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {products?.map((product) => (
            <Card
              key={product.id}
              className="flex-row items-center gap-4 border border-gray-200 p-3 shadow-sm"
            >
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-600">Details</p>
                <p className="text-sm text-gray-600">{product.url}</p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </>
  );
}
