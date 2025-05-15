/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddProductModal from "@/components/addProductModal.tsx";
import EditProductModal from "@/components/editProductModal.tsx";
import { useContext } from "react";
import {
  ProductCategoryType,
  ProductDTO,
  ProjectPatchDTO,
  ProjectDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip.tsx";
import { ApiClientContext } from "@/lib/ApiClientContext.ts";
import { Edit, Pencil, Trash2, X } from "lucide-react";
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

type ProjectWorksProps = { project: ProjectDTO };

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks({ project }: Readonly<ProjectWorksProps>) {
  const apiClient = useContext(ApiClientContext);
  const [editMode, setEditMode] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deletedProduct, setDeletedProduct] = React.useState<ProductDTO | null>(
    null,
  );
  const [editedProduct, setEditedProduct] = React.useState<ProductDTO | null>(
    null,
  );
  const toggleEditMode = () => setEditMode(!editMode);

  const deleteProduct = async () => {
    if (!deletedProduct) return;

    try {
      if (project.products) {
        project.products = project.products.filter(
          (c) => c.id !== deletedProduct.id,
        );
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

      setDeletedProduct(null);
    } catch (error) {
      console.log("Error deleting product:", error);
    }
  };

  return (
    <>
      <CardHeader className="relative flex justify-between">
        <CardTitle className="text-xl font-semibold">Products</CardTitle>
        <div className="absolute right-0 flex items-center justify-between space-x-4 px-4">
          <Button variant="outline" size="sm" onClick={toggleEditMode}>
            {editMode ? (
              <>
                <X className="mr-2 h-4 w-4" /> Exit Edit Mode
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </>
            )}
          </Button>
          <AddProductModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            project={project}
          />
        </div>
      </CardHeader>
      <CardContent>
        {editMode && (
          <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-2 text-center text-sm">
            Edit mode active. You can edit or delete products from the project.
          </div>
        )}

        {[
          ProductCategoryType.Input,
          /*ProductCategoryType.Output,
          ProductCategoryType.Internal,*/
        ].map((catType) => (
          <>
            <h2>{catType.toString()}</h2>
            {project.products?.map((product) => (
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
                        open={
                          isDeleteDialogOpen &&
                          deletedProduct?.id === product.id
                        }
                        onOpenChange={(isOpen) => {
                          if (!isOpen) {
                            setIsDeleteDialogOpen(false);
                            setDeletedProduct(null);
                          }
                        }}
                      >
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove {product.title} from this
                              project. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive hover:text-destructive border-destructive border-1 text-white hover:bg-white/10 hover:font-bold"
                              onClick={deleteProduct}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                {product.url && (
                  <p className="text-sm text-gray-600">{product.url}</p>
                )}
                <Badge variant="secondary" className="h-5 px-2 py-0 text-xs">
                  {product.type}
                </Badge>
              </Card>
            ))}
          </>
        ))}
      </CardContent>
      <EditProductModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={editedProduct!}
        project={project}
      />
    </>
  );
}
