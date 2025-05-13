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
import { Plus } from "lucide-react";

type AddWorkModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: () => void;
};

export default function AddProductModal({
  isOpen,
  onOpenChange,
  onAddProduct,
}: Readonly<AddWorkModalProps>) {
  const [productName, setProductName] = React.useState<string>("");
  const [link, setLink] = React.useState<string>("");
  const [projectType, setProjectType] = React.useState<string>("");

  const handleAddProduct = () => {
    onAddProduct();
    // Reset form fields
    setProductName("");
    setLink("");
    setProjectType("");
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset form fields
    setProductName("");
    setLink("");
    setProjectType("");
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="link" className="text-right">
              Link
            </Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://doi.org/"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="col-span-1 text-right">Type</Label>
            <Select onValueChange={setProjectType} value={projectType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Product types</SelectLabel>
                  <SelectItem value="audiovisual">Audiovisual</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="bookChapter">Book Chapter</SelectItem>
                  <SelectItem value="grapes">Computational Notebook</SelectItem>
                  <SelectItem value="conferencePaper">
                    Conference Paper
                  </SelectItem>
                  <SelectItem value="conferencePoster">
                    Conference Poster
                  </SelectItem>
                  <SelectItem value="conferenceProceeding">
                    Conference Proceeding
                  </SelectItem>
                  <SelectItem value="dataPaper">Data Paper</SelectItem>
                  <SelectItem value="dataset">Dataset</SelectItem>
                  <SelectItem value="dissertation">Dissertation</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="instrument">Instrument</SelectItem>
                  <SelectItem value="journalArticle">
                    Journal Article
                  </SelectItem>
                  <SelectItem value="learningObject">
                    Learning Object
                  </SelectItem>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="outputManagementPlan">
                    Output Management Plan
                  </SelectItem>
                  <SelectItem value="physicalObject">
                    Physical Object
                  </SelectItem>
                  <SelectItem value="preprint">Preprint</SelectItem>
                  <SelectItem value="prize">Prize</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="sound">Sound</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="workflow">Workflow</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            disabled={!productName || !projectType}
          >
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
