/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
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
import { ArrowRight } from "lucide-react";

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
  onDoiAutoFill?: () => Promise<boolean>;
  doiError?: string | null;
}

function getEnumKeys<
  T extends string,
  TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
  return Object.keys(enumVariable) as Array<T>;
}

// Currently supported schemas - only DOI and Archive are fully supported
const supportedSchemas = [ProductSchema.Doi, ProductSchema.Archive];

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
      const digits: number[] = [];
      for (let i = 0; i < isbnWithoutHyphens.length; i++) {
        const char = isbnWithoutHyphens[i];
        if (char >= "0" && char <= "9") {
          digits.push(parseInt(char, 10));
        } else if (char === "X" && i === 9) {
          digits.push(10);
        } else if (char !== " ") {
          return false;
        }
      }

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
      return /^https?:\/\/web.archive.org\/.+$/.test(url);
    },
    placeholder:
      "https://web.archive.org/web/20230101000000/https://example.com",
    description:
      "Web Archive URL (e.g., https://web.archive.org/web/20230101000000/https://example.com)",
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

    case "schema":
      if (schema && !supportedSchemas.includes(schema)) {
        return {
          field,
          message: `${schema} schema is not yet supported by the Dutch RAiD implementation. Currently supported: ${supportedSchemas.join(", ")}`,
        };
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
  onDoiAutoFill,
  doiError,
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

    // Always validate schema when it's set (no need for touched state)
    if (formData.productSchema) {
      const schemaError = validateField("schema", "", formData.productSchema);
      if (schemaError) errors.push(schemaError);
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
          <div className="flex items-center gap-2">
            <Input
              id="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={getUrlPlaceholder()}
              className={`flex-1 ${getFieldError("url") || doiError ? "border-red-500 focus:border-red-500" : ""}`}
            />
            {formData.productSchema === ProductSchema.Doi && onDoiAutoFill && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onDoiAutoFill}
                      disabled={!formData.url}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Autofill title and type using DOI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {(getFieldError("url") || doiError) && (
            <p className="mt-1 text-sm text-red-500">
              {doiError || getFieldError("url")?.message}
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
        <div className="col-span-3">
          <Select
            onValueChange={(e) => {
              handleSchemaChange(
                ProductSchema[e as keyof typeof ProductSchema],
              );
            }}
            value={formData.productSchema}
          >
            <SelectTrigger
              className={`w-[180px] ${getFieldError("schema") ? "border-red-500 focus:border-red-500" : ""}`}
            >
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
          {getFieldError("schema") && (
            <p className="mt-1 text-sm text-red-500">
              {getFieldError("schema")?.message}
            </p>
          )}
        </div>
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
