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
import { ProductDTO } from "@team-golfslag/conflux-api-client/src/client";

type productCardProps = {
  product: ProductDTO;
  editMode: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setEditedProduct: (product: ProductDTO) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  deletedProduct: ProductDTO;
  setDeletedProduct: (product: ProductDTO) => void;
  deleteProduct: (product: ProductDTO) => void;
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
  deleteProduct,
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
                  <AlertDialogAction
                    className="bg-destructive hover:text-destructive border-destructive border-1 text-white hover:bg-white/10 hover:font-bold"
                    onClick={() => deleteProduct}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      {product.url && <p className="text-sm text-gray-600">{product.url}</p>}
      <Badge variant="secondary" className="h-5 px-2 py-0 text-xs">
        {product.type}
      </Badge>
    </Card>
  );
}
