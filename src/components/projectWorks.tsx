/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@team-golfslag/conflux-api-client/src/client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ProjectWorksProps = { products?: Product[] };

/**
 * Project Works component
 * @param props the products to be turned into a card
 */
export default function ProjectWorks({
  products,
}: Readonly<ProjectWorksProps>) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    
    const [productName, setProductName] = React.useState<string>("");
    const [link, setLink] = React.useState<string>("");
    const [projectType, setProjectType] = React.useState<string>("");
    
    const addProduct = async () => {
        setIsModalOpen(false);
    }
    
  return (
    <section className="space-y-4 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Works</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                        Add a product to your project.
                    </DialogDescription>
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
                        <Label className="text-right col-span-1">Type</Label>
                        <Select onValueChange={setProjectType} value={projectType}>
                            <SelectTrigger className="w-[180px] col-span-3">
                                <SelectValue placeholder="Select a product type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Product types</SelectLabel>
                                    <SelectItem value="audiovisual">Audiovisual</SelectItem>
                                    <SelectItem value="book">Book</SelectItem>
                                    <SelectItem value="bookChapter">Book Chapter</SelectItem>
                                    <SelectItem value="grapes">Computational Notebook</SelectItem>
                                    <SelectItem value="conferencePaper">Conference Paper</SelectItem>
                                    <SelectItem value="conferencePoster">Conference Poster</SelectItem>
                                    <SelectItem value="conferenceProceeding">Conference Proceeding</SelectItem>
                                    <SelectItem value="dataPaper">Data Paper</SelectItem>
                                    <SelectItem value="dataset">Dataset</SelectItem>
                                    <SelectItem value="dissertation">Dissertation</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="funding">Funding</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="instrument">Instrument</SelectItem>
                                    <SelectItem value="journalArticle">Journal Article</SelectItem>
                                    <SelectItem value="learningObject">Learning Object</SelectItem>
                                    <SelectItem value="model">Model</SelectItem>
                                    <SelectItem value="outputManagementPlan">Output Management Plan</SelectItem>
                                    <SelectItem value="physicalObject">Physical Object</SelectItem>
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
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            setIsModalOpen(false);
                            setProductName("");
                            setLink("");
                            setProjectType("");
                        }}>
                        Cancel
                    </Button>
                    <Button onClick={addProduct} disabled={!productName || !projectType}>Add Product</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      {products?.map((product) => (
        <Card key={product.id} className="bg-gray-200">
          <CardContent className="flex items-center gap-4 p-3">
            <div>
              <p className="font-semibold">{product.title}</p>
              <p className="text-sm text-gray-600">Details</p>
              <p className="text-sm text-gray-600">{product.url}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
