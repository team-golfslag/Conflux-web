/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { JSX } from "react";

type EditButtonProps = {
  handleEditClick: () => void;
  editOrSave?: "edit" | "save" | "cancel";
};

export function EditButton(props: Readonly<EditButtonProps>) {
  let buttonContent: JSX.Element;
  switch (props.editOrSave) {
    case "save":
      buttonContent = (
        <>
          <Save className="mr-1 h-4 w-4" />
          Save
        </>
      );
      break;
    case "cancel":
      buttonContent = <>Cancel</>;
      break;
    case "edit":
    default:
      buttonContent = (
        <>
          <Edit className="mr-1 h-4 w-4" />
          Edit
        </>
      );
      break;
  }

  return (
    <Button
      className="float-end"
      variant="outline"
      size="sm"
      onClick={props.handleEditClick}
    >
      {buttonContent}
    </Button>
  );
}
