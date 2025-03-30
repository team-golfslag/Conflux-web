/*
  This program has been developed by students from the bachelor Computer Science at Utrecht
  University within the Software Models course.

  © Copyright Utrecht University (Department of Information and Computing Sciences)
*/

import {Card, CardContent} from "@/components/ui/card";
import {Product} from "@/types/product.ts";

type ProjectWorksProps = { products: Product[] }

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks(props: ProjectWorksProps) {
    return (
        <section className="space-y-4 bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Works</h2>
            {props.products.map((product) => (
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
