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
    <Card className="flex flex-col gap-1 border border-gray-200 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{product.title}</p>
        {editMode && (
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 text-blue-500 hover:text-blue-700"
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
                        className="text-destructive hover:text-destructive/80 p-0"
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setDeletedProduct(product);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Delete contributor</TooltipContent>
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
                        className="border-destructive bg-destructive hover:text-destructive border-1 text-white hover:bg-white/10 hover:font-bold"
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
      {product.url && <p className="text-sm text-gray-600">{product.url}</p>}
      <div className="flex flex-wrap gap-1">
        <Badge variant="secondary" className="h-5 px-2 py-0 text-xs">
          {product.type}
        </Badge>
        {product.schema && (
          <Badge variant="outline" className="h-5 px-2 py-0 text-xs">
            {product.schema}
          </Badge>
        )}
        {product.categories?.map((category) => (
          <Badge
            key={category}
            variant="default"
            className="h-5 px-2 py-0 text-xs"
          >
            {category}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
