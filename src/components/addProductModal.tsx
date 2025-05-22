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
  ProductDTO,
  ProductType,
  ProjectPatchDTO,
  ProjectDTO,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { useContext } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import ProductFormFields from "@/components/productFormFields.tsx";
import { ProductFormData } from "@/components/productFormFields.tsx";

type AddWorkModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectDTO;
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
  const [category, setCategory] = React.useState<
    ProductCategoryType | undefined
  >();

  const resetModal = () => {
    setProductTitle("");
    setUrl("");
    setProductType(undefined);
    setCategory(undefined);
  };

  const productData: ProductFormData = {
    url: url,
    title: productTitle,
    productType: productType!,
    productCategory: category!,
  };

  const addProduct = async () => {
    try {
      if (productType && category) {
        const newProduct = new ProductDTO({
          url: url,
          title: productTitle,
          type: productType,
          categories: [category],
        });

        project.products.push(newProduct);

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
      resetModal();
    } catch (error) {
      console.log("Error adding product:", error);
      alert(
        `Failed to add product: ${
          error instanceof Error ? error.message : "Unkown error"
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
          setCategory={setCategory}
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
          <Button onClick={addProduct} disabled={!productTitle || !productType}>
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
