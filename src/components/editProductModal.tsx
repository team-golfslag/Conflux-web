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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type AddWorkModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductDTO;
  project: ProjectDTO;
};

function getEnumKeys<
  T extends string,
  TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
  return Object.keys(enumVariable) as Array<T>;
}

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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              url
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://doi.org/"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="col-span-1 text-right">Type</Label>
            <Select
              onValueChange={(e) => {
                setProductType(ProductType[e as keyof typeof ProductType]);
              }}
              value={productType}
            >
              <SelectTrigger className="col-span-3 w-[180px]">
                <SelectValue placeholder="Select a product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product types</SelectLabel>
                  {getEnumKeys(ProductType).map((key, index) => (
                    <SelectItem key={index} value={ProductType[key]}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Label htmlFor="category" className="col-span-1 text-right">
              Category
            </Label>
            <Select
              onValueChange={(e) => {
                setCategory(
                  ProductCategoryType[e as keyof typeof ProductCategoryType],
                );
              }}
              value={category}
            >
              <SelectTrigger className="col-span-3 w-[180px]">
                <SelectValue placeholder="Select a product category type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {getEnumKeys(ProductCategoryType).map((key, index) => (
                    <SelectItem key={index} value={ProductCategoryType[key]}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
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
