/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ProductCategoryType,
  ProductDTO,
  ProductType,
  ProjectPatchDTO,
  ProjectDTO,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { useContext, useEffect } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import ProductFormFields, {
  ProductFormData,
} from "@/components/productFormFields.tsx";

type AddWorkModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDTO;
  project: ProjectDTO;
};

export default function AddProductModal({
  isOpen,
  onOpenChange,
  product,
  project,
}: Readonly<AddWorkModalProps>) {
  const apiClient = useContext(ApiClientContext);

  const [productTitle, setProductTitle] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");
  const [productType, setProductType] = React.useState<
    ProductType | undefined
  >();
  const [category, setCategory] = React.useState<
    ProductCategoryType | undefined
  >();

  useEffect(() => {
    if (product) {
      setProductTitle(product.title);
      if (product.url) setUrl(product.url);
      setProductType(product.type);
      setCategory(product.categories[0]);
    }
  }, [product]);

  const productData: ProductFormData = {
    url: url,
    title: productTitle,
    productType: productType!,
    productCategory: category!,
  };

  const saveEditedProduct = async () => {
    if (!product) return;
    try {
      if (productType && category) {
        const newProduct = new ProductDTO({
          id: product.id,
          url: url,
          title: productTitle,
          type: productType,
          categories: [category],
        });

        const index = project.products.findIndex((c) => c.id === newProduct.id);
        if (index !== -1) {
          project.products[index] = newProduct;
        }

        const projectPatchDTO = new ProjectPatchDTO({
          products: project.products,
        });
        const updatedProject = await apiClient.projects_PatchProject(
          project.id,
          projectPatchDTO,
        );

        if (!updatedProject) {
          throw new Error("Server returned an invalid product");
        }
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        `Failed to update product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit the product of your project.
          </DialogDescription>
        </DialogHeader>
        <ProductFormFields
          formData={productData}
          setProductTitle={setProductTitle}
          setUrl={setUrl}
          setProductType={setProductType}
          setCategory={setCategory}
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveEditedProduct}
            disabled={!productTitle || !productType}
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
