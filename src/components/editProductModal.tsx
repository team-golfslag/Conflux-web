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
  ProductRequestDTO,
  ProductResponseDTO,
  ProductType,
  ProductSchema,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { useContext, useEffect } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import ProductFormFields, {
  ProductFormData,
} from "@/components/productFormFields.tsx";

type EditProductModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductResponseDTO;
  project: ProjectResponseDTO;
  onProductUpdate?: () => void;
};

export default function EditProductModal({
  isOpen,
  onOpenChange,
  product,
  project,
  onProductUpdate,
}: Readonly<EditProductModalProps>) {
  const apiClient = useContext(ApiClientContext);

  const [productTitle, setProductTitle] = React.useState<string>("");
  const [url, setUrl] = React.useState<string>("");
  const [productType, setProductType] = React.useState<
    ProductType | undefined
  >();
  const [productSchema, setProductSchema] = React.useState<
    ProductSchema | undefined
  >();
  const [categories, setCategories] = React.useState<ProductCategoryType[]>([]);

  const handleCategoryChange = (category: ProductCategoryType) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  useEffect(() => {
    if (product) {
      setProductTitle(product.title);
      if (product.url) setUrl(product.url);
      setProductType(product.type);
      setCategories(product.categories || []);
      setProductSchema(product.schema);
    }
  }, [product]);

  const productData: ProductFormData = {
    url: url,
    title: productTitle,
    productType: productType!,
    productSchema: productSchema!,
    categories: categories,
  };

  const saveEditedProduct = async () => {
    if (!product) return;
    try {
      if (productType && productSchema && categories.length > 0) {
        // Update the product using the products_UpdateProduct API
        const updatedProduct = new ProductRequestDTO({
          url: url,
          title: productTitle,
          type: productType,
          categories: categories,
          schema: productSchema,
        });

        const result = await apiClient.products_UpdateProduct(
          project.id,
          product.id,
          updatedProduct,
        );

        if (!result) {
          throw new Error("Server returned an invalid product");
        }
      }

      onOpenChange(false);
      if (onProductUpdate) {
        onProductUpdate();
      }
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
          setSchema={setProductSchema}
          onCategoryChange={handleCategoryChange}
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
            disabled={
              !productTitle ||
              !productType ||
              !productSchema ||
              categories.length === 0
            }
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
