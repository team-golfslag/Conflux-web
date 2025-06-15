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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";
import {
  ProductCategoryType,
  ProductRequestDTO,
  ProductSchema,
  ProductType,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client.ts";
import { useContext } from "react";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import ProductFormFields from "@/components/product/productFormFields";
import { ProductFormData } from "@/components/product/productFormFields";

type AddWorkModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectResponseDTO;
  onProjectUpdate: () => void;
};

export default function AddProductModal({
  isOpen,
  onOpenChange,
  project,
  onProjectUpdate,
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

  // Error modal state
  const [showErrorModal, setShowErrorModal] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  // DOI autofill state
  const [doiError, setDoiError] = React.useState<string | null>(null);

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
    setShowErrorModal(false);
    setErrorMessage("");
    setDoiError(null);
  };

  // Handle URL change to clear DOI error
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    if (doiError) setDoiError(null);
  };

  // DOI autofill function
  const handleDoiAutoFill = async (): Promise<boolean> => {
    if (!url || productSchema !== ProductSchema.Doi) return false;

    setDoiError(null);

    try {
      // Extract DOI from URL if it's a full DOI URL
      let doi = url;
      const doiMatch = url.match(/(?:doi\.org\/|DOI:)?(10\.\d+\/.+)$/);
      if (doiMatch) {
        doi = doiMatch[1];
      }

      const result = await apiClient.products_GetInfoFromDoi(doi);
      if (result) {
        if (result.title) {
          setProductTitle(result.title);
        }
        if (result.type) {
          setProductType(result.type);
        }
        return true;
      } else {
        setDoiError("No information found for this DOI.");
        return false;
      }
    } catch (error) {
      console.error("Error fetching DOI info:", error);
      setDoiError("Failed to fetch DOI information. Please try again.");
      return false;
    }
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
      onProjectUpdate(); // Call this to refresh the project data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Failed to add product: ${message}`);
      setShowErrorModal(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-0 bg-white/95 shadow-2xl backdrop-blur-md sm:max-w-[600px]">
          <DialogHeader className="space-y-3 border-b border-gray-100 pb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="rounded-lg bg-gray-100 p-2">
                <Plus className="h-6 w-6 text-gray-600" />
              </div>
              Add Product
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Add a new product to showcase the research outputs of your
              project.
            </DialogDescription>
          </DialogHeader>
          <ProductFormFields
            formData={productData}
            setProductTitle={setProductTitle}
            setUrl={handleUrlChange}
            setProductType={setProductType}
            setSchema={setProductSchema}
            onCategoryChange={handleCategoryChange}
            onDoiAutoFill={handleDoiAutoFill}
            doiError={doiError}
          />
          <DialogFooter className="flex gap-3 border-t border-gray-100 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetModal();
              }}
              className="transition-all duration-200 hover:scale-105 hover:bg-gray-50"
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
              className="bg-gray-800 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gray-900 disabled:opacity-50"
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <AlertDialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error Adding Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowErrorModal(false)}
              className="bg-destructive hover:bg-destructive/90"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
