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
import { useState, useEffect } from "react";

export interface ProductFormData {
  title: string;
  url: string;
  productType: ProductType;
  productSchema: ProductSchema;
  categories: ProductCategoryType[];
}

interface ValidationError {
  field: string;
  message: string;
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

// Validation functions for different schemas
const urlValidationFunctions = {
  [ProductSchema.Doi]: {
    validate: (url: string): boolean => {
      return /^https?:\/\/(?:dx\.)?doi\.org\/10\.\d+\/.+$/.test(url);
    },
    placeholder: "https://doi.org/10.1000/example",
    description: "DOI URL (e.g., https://doi.org/10.1000/example)",
  },
  [ProductSchema.Ark]: {
    validate: (url: string): boolean => {
      return /^https?:\/\/.+\/ark:\/\d+\/.+$/.test(url);
    },
    placeholder: "https://example.org/ark:/12345/example",
    description: "ARK URL (e.g., https://example.org/ark:/12345/example)",
  },
  [ProductSchema.Handle]: {
    validate: (url: string): boolean => {
      return /^([^/]+(?:\.[^/]+)*)\/([^/]+)$/.test(url);
    },
    placeholder: "12345/hdl1",
    description: "Handle URL (e.g., 12345/hdl1)",
  },
  [ProductSchema.Isbn]: {
    validate: (url: string): boolean => {
      const isbnWithoutHyphens = url.replace(/-/g, "");
      const digits = Array(isbnWithoutHyphens).map(Number);
      if (digits.length !== 10 && digits.length !== 13) {
        return false;
      }
      let t = 0,
        s = 0;

      if (digits.length === 10) {
        for (let i = 0; i < 10; ++i) {
          t += digits[i];
          s += t;
        }
        return s % 11 === 0;
      }

      for (let i = 0; i < 12; ++i) {
        t += digits[i] * (i % 2 === 0 ? 1 : 3);
      }
      return (10 - (t % 10)) % 10 === digits[12];
    },
    placeholder: "978-0123456789 or URL",
    description: "ISBN (978-0123456789) or URL containing ISBN",
  },
  [ProductSchema.Rrid]: {
    validate: (url: string): boolean => {
      return /^RRID:.+$/.test(url);
    },
    placeholder: "RRID:AB_123456 or URL",
    description: "RRID identifier (RRID:AB_123456) or URL",
  },
  [ProductSchema.Archive]: {
    validate: (url: string): boolean => {
      return /^https?:\/\/.+$/.test(url);
    },
    placeholder: "https://example.com/archive/item",
    description: "Any valid URL",
  },
};

function validateField(
  field: string,
  value: string,
  schema?: ProductSchema,
): ValidationError | null {
  switch (field) {
    case "title":
      if (!value.trim()) {
        return { field, message: "Title is required" };
      }
      if (value.length < 3) {
        return { field, message: "Title must be at least 3 characters long" };
      }
      break;

    case "url":
      if (!value.trim()) {
        return { field, message: "URL is required" };
      }

      if (schema && urlValidationFunctions[schema]) {
        const { validate, description } = urlValidationFunctions[schema];
        if (!validate(value)) {
          return { field, message: `Invalid format. Expected: ${description}` };
        }
      } else {
        // Fallback to basic URL validation
        const basicUrlPattern = /^https?:\/\/.+$/;
        if (!basicUrlPattern.test(value)) {
          return { field, message: "URL must start with http:// or https://" };
        }
      }
      break;
  }

  return null;
}

export default function ProductFormFields({
  formData,
  setProductTitle,
  setUrl,
  setSchema,
  setProductType,
  onCategoryChange,
}: Readonly<ProductFormFieldsProps>) {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Validate fields when form data changes
  useEffect(() => {
    const errors: ValidationError[] = [];

    if (touched.title) {
      const titleError = validateField("title", formData.title);
      if (titleError) errors.push(titleError);
    }

    if (touched.url) {
      const urlError = validateField(
        "url",
        formData.url,
        formData.productSchema,
      );
      if (urlError) errors.push(urlError);
    }

    setValidationErrors(errors);
  }, [formData, touched]);

  const handleTitleChange = (value: string) => {
    setProductTitle(value);
    setTouched((prev) => ({ ...prev, title: true }));
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setTouched((prev) => ({ ...prev, url: true }));
  };

  const handleSchemaChange = (schema: ProductSchema) => {
    setSchema(schema);
    // Re-validate URL when schema changes
    if (touched.url) {
      setTouched((prev) => ({ ...prev, url: true }));
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors.find((error) => error.field === field);
  };

  const getUrlPlaceholder = () => {
    if (
      formData.productSchema &&
      urlValidationFunctions[formData.productSchema]
    ) {
      return urlValidationFunctions[formData.productSchema].placeholder;
    }
    return "https://doi.org/";
  };

  return (
    <div className="grid gap-6 py-6">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label
          htmlFor="title"
          className="text-right font-semibold text-gray-700"
        >
          Title
        </Label>
        <div className="col-span-3">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`${getFieldError("title") ? "border-red-500 focus:border-red-500" : ""}`}
            placeholder="Enter product title"
          />
          {getFieldError("title") && (
            <p className="mt-1 text-sm text-red-500">
              {getFieldError("title")?.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right font-semibold text-gray-700">
          URL
        </Label>
        <div className="col-span-3">
          <Input
            id="url"
            value={formData.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={getUrlPlaceholder()}
            className={`${getFieldError("url") ? "border-red-500 focus:border-red-500" : ""}`}
          />
          {getFieldError("url") && (
            <p className="mt-1 text-sm text-red-500">
              {getFieldError("url")?.message}
            </p>
          )}
          {formData.productSchema &&
            urlValidationFunctions[formData.productSchema] && (
              <p className="mt-1 text-xs text-gray-500">
                {urlValidationFunctions[formData.productSchema].description}
              </p>
            )}
        </div>
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
            handleSchemaChange(ProductSchema[e as keyof typeof ProductSchema]);
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
