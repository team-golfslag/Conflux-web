/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  ApiClient,
  ProductResponseDTO,
  ProjectResponseDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { ApiMutation } from "@/components/apiMutation.tsx";

type productCardProps = {
  product: ProductResponseDTO;
  editMode: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setEditedProduct: (product: ProductResponseDTO) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  deletedProduct: ProductResponseDTO;
  setDeletedProduct: (product: ProductResponseDTO) => void;
  project: ProjectResponseDTO;
  onProjectUpdate: () => void;
};

export default function ProductCard({
  product,
  editMode,
  setIsEditModalOpen,
  setEditedProduct,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  deletedProduct,
  setDeletedProduct,
  project,
  onProjectUpdate,
}: Readonly<productCardProps>) {
  return (
    <Card className="group/productCard border-gray-200/60 bg-white transition-all duration-300">
      <div className="flex items-center justify-between p-3">
        <h3 className="text-base font-semibold text-gray-900 transition-colors duration-200 group-hover/productCard:text-gray-800">
          {product.title}
        </h3>
        {editMode && (
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 rounded-lg p-0 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:text-gray-800"
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setEditedProduct(product);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Product</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 rounded-lg p-0 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setDeletedProduct(product);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete Product</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDialog>
            <AlertDialog
              open={isDeleteDialogOpen && deletedProduct?.id === product.id}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setIsDeleteDialogOpen(false);
                  setDeletedProduct(null!);
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove {product.title} from this project. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <ApiMutation
                    mutationFn={(apiClient: ApiClient) =>
                      apiClient.products_DeleteProduct(project.id, product.id)
                    }
                    data={{}}
                    loadingMessage="Deleting product..."
                    mode="component"
                    onSuccess={() => {
                      onProjectUpdate();
                      setIsDeleteDialogOpen(false);
                      setDeletedProduct(null!);
                    }}
                  >
                    {({ onSubmit }) => (
                      <AlertDialogAction
                        className="border-0 bg-red-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-red-700"
                        onClick={onSubmit}
                      >
                        Delete
                      </AlertDialogAction>
                    )}
                  </ApiMutation>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="space-y-2 px-3">
        {product.url && (
          <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-2">
            <p className="font-mono text-xs break-all text-gray-600">
              {product.url}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="border-gray-200/50 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-transform duration-200 hover:scale-105"
          >
            {product.type}
          </Badge>
          {product.schema && (
            <Badge
              variant="outline"
              className="border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-transform duration-200 hover:scale-105"
            >
              {product.schema}
            </Badge>
          )}
          {product.categories?.map((category) => (
            <Badge
              key={category}
              variant="default"
              className="border-gray-200/50 px-3 py-1 text-xs font-medium transition-transform duration-200 hover:scale-105"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
