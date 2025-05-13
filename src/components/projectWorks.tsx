/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductDTO } from "@team-golfslag/conflux-api-client/src/client";
import AddProductModal from "@/components/addProductModal.tsx";

type ProjectWorksProps = { products?: ProductDTO[] };

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks({
  products,
}: Readonly<ProjectWorksProps>) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const addProduct = async () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CardHeader className="flex justify-between">
        <CardTitle className="text-xl font-semibold">Works</CardTitle>
        <AddProductModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onAddProduct={addProduct}
        />
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
