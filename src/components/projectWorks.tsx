/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddProductModal from "@/components/addProductModal.tsx";
import EditProductModal from "@/components/editProductModal.tsx";
import {
  ProductCategoryType,
  ProductDTO,
  ProjectDTO,
} from "@team-golfslag/conflux-api-client/src/client";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import ProductCard from "@/components/productCard.tsx";

type ProjectWorksProps = { project: ProjectDTO; onProjectUpdate: () => void };

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks({
  project,
  onProjectUpdate,
}: Readonly<ProjectWorksProps>) {
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
          ProductCategoryType.Output,
          ProductCategoryType.Internal,
        ].map((catType) => (
          <>
            {project.products?.filter((p) =>
              p.categories.some((c) => c === catType),
            ).length > 0 ? (
              <h2>{catType.toString()}</h2>
            ) : (
              ""
            )}
            {project.products
              ?.filter((p) => p.categories.some((c) => c === catType))
              .map((product) => (
                <ProductCard
                  product={product}
                  editMode={editMode}
                  setIsEditModalOpen={setIsEditModalOpen}
                  setEditedProduct={setEditedProduct}
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  deletedProduct={deletedProduct!}
                  setDeletedProduct={setDeletedProduct}
                  project={project}
                  onProjectUpdate={onProjectUpdate}
                />
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
