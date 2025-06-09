/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  ProductCategoryType,
  ProductType,
  ProductSchema,
} from "@team-golfslag/conflux-api-client/src/client.ts";

export interface ProductFormData {
  title: string;
  url: string;
  productType: ProductType;
  productSchema: ProductSchema;
  categories: ProductCategoryType[];
}

interface ProductFormFieldsProps {
  formData: ProductFormData;
  setProductTitle: (title: string) => void;
  setUrl: (url: string) => void;
  setProductType: (productType: ProductType) => void;
  setSchema: (schema: ProductSchema) => void;
  onCategoryChange: (category: ProductCategoryType) => void;
}

function getEnumKeys<
  T extends string,
  TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
  return Object.keys(enumVariable) as Array<T>;
}

export default function ProductFormFields({
  formData,
  setProductTitle,
  setUrl,
  setSchema,
  setProductType,
  onCategoryChange,
}: Readonly<ProductFormFieldsProps>) {
  return (
    <div className="grid gap-6 py-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor="title"
          className="text-right font-semibold text-gray-700"
        >
          Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setProductTitle(e.target.value)}
          className="col-span-3"
          placeholder="Enter product title"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right font-semibold text-gray-700">
          URL
        </Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://doi.org/"
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="col-span-1 text-right font-semibold text-gray-700">
          Type
        </Label>
        <Select
          onValueChange={(e) => {
            setProductType(ProductType[e as keyof typeof ProductType]);
          }}
          value={formData.productType}
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

        <Label
          htmlFor="schema"
          className="col-span-1 text-right font-semibold text-gray-700"
        >
          Schema
        </Label>
        <Select
          onValueChange={(e) => {
            setSchema(ProductSchema[e as keyof typeof ProductSchema]);
          }}
          value={formData.productSchema}
        >
          <SelectTrigger className="col-span-3 w-[180px]">
            <SelectValue placeholder="Select a schema" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Schema</SelectLabel>
              {getEnumKeys(ProductSchema).map((key, index) => (
                <SelectItem key={index} value={ProductSchema[key]}>
                  {key}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="pt-2 text-right font-semibold text-gray-700">
          Categories
        </Label>
        <div className="col-span-3 flex flex-wrap gap-3">
          {Object.values(ProductCategoryType).map((category) => (
            <TooltipProvider key={category}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant={
                      formData.categories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                    onClick={() => onCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Click to{" "}
                  {formData.categories.includes(category) ? "remove" : "add"}{" "}
                  {category} category
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
}
