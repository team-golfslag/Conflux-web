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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  ProductCategoryType,
  ProductRequestDTO,
  ProductSchema,
  ProductType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { useContext } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import ProductFormFields from "@/components/productFormFields.tsx";
import { ProductFormData } from "@/components/productFormFields.tsx";

type AddWorkModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectResponseDTO;
};

export default function AddProductModal({
  isOpen,
  onOpenChange,
  project,
}: Readonly<AddWorkModalProps>) {
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

  const resetModal = () => {
    setProductTitle("");
    setUrl("");
    setProductType(undefined);
    setProductSchema(undefined);
    setCategories([]);
  };

  const productData: ProductFormData = {
    url: url,
    title: productTitle,
    productType: productType!,
    productSchema: productSchema!,
    categories: categories,
  };

  const addProduct = async () => {
    try {
      if (productType && productSchema && categories.length > 0) {
        const newProduct = new ProductRequestDTO({
          url: url,
          title: productTitle,
          type: productType,
          categories: categories,
          schema: productSchema,
        });

        const createdProduct = await apiClient.products_CreateProduct(
          project.id,
          newProduct,
        );

        if (!createdProduct) {
          throw new Error(`Failed to create product`);
        }
      }
      onOpenChange(false);
      resetModal();
    } catch (error) {
      console.log("Error adding product:", error);
      alert(
        `Failed to add product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>Add a product to your project.</DialogDescription>
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
              resetModal();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={addProduct}
            disabled={
              !productTitle ||
              !productType ||
              !productSchema ||
              categories.length === 0
            }
          >
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
