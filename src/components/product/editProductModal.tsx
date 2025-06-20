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
import { Pencil } from "lucide-react";
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
} from "@/components/product/productFormFields";

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

  // Validation state
  const [hasValidationErrors, setHasValidationErrors] =
    React.useState<boolean>(false);

  const handleCategoryChange = (category: ProductCategoryType) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleError = (message: string) => {
    alert(`Failed to update product: ${message}`);
  };

  useEffect(() => {
    if (product) {
      setProductTitle(product.title);
      if (product.url) setUrl(product.url);
      setProductType(product.type);
      setCategories(product.categories || []);
      setProductSchema(product.schema);
      setHasValidationErrors(false); // Reset validation state when loading new product
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
      <DialogContent className="max-h-[90vh] overflow-y-auto border-0 bg-white/95 shadow-2xl backdrop-blur-md sm:max-w-[600px]">
        <DialogHeader className="space-y-3 border-b border-gray-100 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="rounded-lg bg-gray-100 p-2">
              <Pencil className="h-6 w-6 text-gray-600" />
            </div>
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Update the product information and categories for your project.
          </DialogDescription>
        </DialogHeader>
        <ProductFormFields
          formData={productData}
          setProductTitle={setProductTitle}
          setUrl={setUrl}
          setProductType={setProductType}
          setSchema={setProductSchema}
          onCategoryChange={handleCategoryChange}
          onValidationChange={setHasValidationErrors}
          onError={handleError}
        />
        <DialogFooter className="flex gap-3 border-t border-gray-100 pt-6">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
            className="transition-all duration-200 hover:scale-105 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={saveEditedProduct}
            disabled={
              !productTitle ||
              !productType ||
              !productSchema ||
              categories.length === 0 ||
              hasValidationErrors
            }
            className="bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
